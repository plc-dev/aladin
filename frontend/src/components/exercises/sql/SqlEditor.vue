<template>
  <div class="sql__editor">
    <textarea
      class="sql__editor--textfield"
      v-model="userQuery"
      @keydown="handleKeyCombination"
    >
    </textarea>
    <div class="sql__editor--controls">
      <Button
        class="sql__button"
        :text="'Abschicken'"
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
import { isObjectEqual } from "@/lib/helper";

export default {
  props: {
    type: { type: String, required: true },
    queryIndex: { type: Number }
  },
  components: {
    Button
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
      if (this.type === "existing") {
        payload = {
          userQuery: this.queryList[this.queryIndex].userQuery,
          query: this.queryList[this.queryIndex].query,
          dbName: this.selectedDB,
          index: this.queryIndex,
          type: this.type
        };
      } else if (this.type === "generated") {
        payload = {
          userQuery: this.userQuery,
          query: this.$store.state.sql.generated[this.selectedDB][
            this.queryIndex
          ].query,
          dbName: this.selectedDB,
          index: this.queryIndex,
          type: this.type
        };
      }

      this.$store.dispatch("sql/submitQuery", payload).then(() => {
        document.querySelectorAll(
          `.accordion__${this.type} .sql__editor--result`
        )[this.queryIndex].innerHTML = this.result;
        this.validate(this.type);
      });
    },
    validate: function(type) {
      const query = document.querySelectorAll(`.accordion__${this.type}--item`)[
        this.queryIndex
      ];
      let userResult, result;
      if (type === "generated") {
        userResult = this.$store.state.sql.generated[this.selectedDB][
          this.queryIndex
        ].userResult;
        result = this.$store.state.sql.generated[this.selectedDB][
          this.queryIndex
        ].result;
      } else {
        userResult = this.queryList[this.queryIndex].userResult;
        result = this.queryList[this.queryIndex].result;
      }
      if (isObjectEqual(userResult, result)) {
        query.classList.add("success");
        query.classList.remove("error");
      } else {
        query.classList.remove("success");
        query.classList.add("error");
      }
    }
  },
  computed: {
    queryList() {
      return this.$store.state.sql.queryList;
    },
    selectedDB() {
      return this.$store.state.sql.selectedDB.dbName;
    },
    userQuery: {
      get: function() {
        if (this.type === "existing") {
          return this.queryList[this.queryIndex].userQuery;
        } else if (this.type === "generated") {
          const selectedDB = this.$store.state.sql.selectedDB.dbName;
          return this.$store.state.sql.generated[selectedDB][this.queryIndex]
            .userQuery;
        }
        return [];
      },
      set: function(userQuery) {
        if (this.type === "existing") {
          this.$store.commit("sql/SET_USER_QUERY_LIST", {
            userQuery,
            index: this.queryIndex
          });
        } else if (this.type === "generated") {
          this.$store.commit("sql/SET_USER_QUERY_GENERATED", {
            userQuery,
            index: this.queryIndex
          });
        }
      }
    },
    result() {
      return this.$store.getters["sql/getFormatedResult"]({
        index: this.queryIndex,
        type: this.type
      });
    }
  }
};
</script>
