<template>
  <div class="sql__editor">
    <codemirror
      v-model="userQuery"
      :options="cmOptions"
      @keydown.native="handleKeyCombination"
    >
    </codemirror>
    <div class="sql__editor--controls">
      <Button
        class="sql__button"
        :text="texts.buttons.submitQuery"
        type="submit"
        @click.native="submitQuery"
      />
    </div>
    <div>
      <div class="sql__editor--result"></div>
    </div>
  </div>
</template>

<style lang="postcss">
.sql__editor {
  @apply flex flex-col w-full;
}

.sql__editor > * {
  @apply p-2;
}

.sql__editor--textfield {
  @apply w-full h-32;
  border: solid 1px black;
  min-height: 50px;
}

.sql__button {
  @apply text-center;
  margin-left: auto;
  margin-right: auto;
}

.sql__editor--result {
  @apply flex;
  height: auto;
  overflow-x: scroll;
}

.sql__editor--result * {
  @apply text-center;
  border: 1px solid black;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
}
</style>

<script>
import Button from "@/components/Button";
import { isObjectFuzzyEqual } from "@/lib/helper";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-light.css";
import "codemirror/mode/sql/sql.js";
import "codemirror/addon/hint/sql-hint";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/theme/base16-dark.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";

export default {
  data() {
    return {
      cmOptions: {
        tabSize: 4,
        mode: "text/x-mysql",
        theme: "base16-light",
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        events: ["keydown"],
        lineWrapping: true,
        foldGutter: true,
        matchBrackets: true
      },
      index: this.queryIndex,
      queryElements: [],
      firstShift: false
    };
  },
  props: {
    type: { type: String, required: true },
    queryIndex: { type: Number }
  },
  components: {
    Button,
    codemirror
  },
  methods: {
    handleKeyCombination: function(event) {
      // ctrl + enter
      if (event.ctrlKey && event.keyCode == 13) {
        this.submitQuery();
      }
    },
    submitQuery: function() {
      let payload;
      if (this.type === "generated") {
        payload = {
          userQuery: this.userQuery,
          query: this.$store.state.sql[`${this.type}QueryList`][
            this.selectedDB
          ][this.index].query,
          dbName: this.selectedDB,
          index: this.index,
          type: this.type
        };
      } else {
        payload = {
          userQuery: this[`${this.type}QueryList`][this.index].userQuery,
          query: this[`${this.type}QueryList`][this.index].query,
          dbName: this.selectedDB,
          index: this.index,
          type: this.type
        };
      }

      const queryElement = document.querySelectorAll(
        `.accordion__${this.type} .accordion__${this.type}--item`
      )[this.index];

      this.$store.dispatch("sql/submitQuery", payload).then(() => {
        queryElement.querySelector(
          ".sql__editor--result"
        ).innerHTML = this.result;
        queryElement.scrollIntoView({ behavior: "auto" });
        this.validate(this.type);
      });
    },
    validate: function(type) {
      const items = document.querySelectorAll(`.accordion__${this.type}--item`);
      const index = this.reverse ? items.length - 1 - this.index : this.index;
      const query = items[index];
      let userResult, result;
      if (type === "generated") {
        userResult = this.$store.state.sql[`${this.type}QueryList`][
          this.selectedDB
        ][index].userResult;
        result = this.$store.state.sql[`${this.type}QueryList`][
          this.selectedDB
        ][index].result;
      } else {
        userResult = this[`${this.type}QueryList`][index].userResult;
        result = this[`${this.type}QueryList`][index].result;
      }
      if (isObjectFuzzyEqual(userResult, result, 5)) {
        query.classList.add("success");
        query.classList.remove("error");
      } else {
        query.classList.remove("success");
        query.classList.add("error");
      }
    }
  },
  computed: {
    texts() {
      const texts = this.$store.state.user.texts.exercises.sql.tabs.SqlTask;
      return {
        buttons: texts.buttons
      };
    },
    existingQueryList() {
      return this.$store.state.sql.existingQueryList;
    },
    proposedQueryList() {
      return this.$store.state.sql.proposedQueryList;
    },
    selectedDB() {
      return this.$store.state.sql.selectedDB.dbName;
    },
    userQuery: {
      get: function() {
        if (this.type === "generated") {
          const selectedDB = this.$store.state.sql.selectedDB.dbName;
          return this.$store.state.sql[`${this.type}QueryList`][selectedDB][
            this.index
          ].userQuery;
        } else {
          return this[`${this.type}QueryList`][this.index].userQuery;
        }
      },
      set: function(userQuery) {
        if (this.type === "generated") {
          this.$store.commit("sql/SET_USER_QUERY_GENERATED", {
            userQuery,
            index: this.index
          });
        } else {
          this.$store.commit("sql/SET_USER_QUERY_LIST", {
            userQuery,
            index: this.index,
            type: this.type
          });
        }
      }
    },
    result() {
      return this.$store.getters["sql/getFormatedResult"]({
        index: this.index,
        type: this.type
      });
    }
  },
  mounted() {
    this.queryElements = document.querySelectorAll(
      `.accordion__${this.type}--item`
    );
  }
};
</script>
