<template>
  <div class="sql__editor">
    <textarea
      class="sql__editor--textfield"
      v-model="userQuery"
      @keydown="handleKeyCombination"
    ></textarea>
    <div class="sql__editor--controls">
      <Button
        class="sql__button"
        :text="'Abschicken'"
        type="submit"
        @click.native="submitQuery"
      />
    </div>
    <div class="sql__editor--result"></div>
  </div>
</template>

<style lang="postcss">
.sql__editor {
  @apply flex flex-col w-full items-center;
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
}

.sql__editor--result {
  height: auto;
}

.sql__editor--result * {
  border: 1px solid black;
}
</style>

<script>
import Button from "@/components/Button";
import { isObjectEqual } from "@/lib/helper";

export default {
  props: {
    queryIndex: { type: Number, required: true }
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
      const payload = {
        userQuery: this.queryList[this.queryIndex].userQuery,
        query: this.queryList[this.queryIndex].query,
        dbName: this.$store.state.sql.selectedDB.dbName,
        index: this.queryIndex
      };

      this.$store.dispatch("sql/submitQuery", payload).then(() => {
        document.querySelectorAll(".sql__editor--result")[
          this.queryIndex
        ].innerHTML = this.result;
        this.validate();
      });
    },
    validate: function() {
      const query = document.querySelectorAll(".accordion__queryList--item")[
        this.queryIndex
      ];
      if (
        isObjectEqual(
          this.queryList[this.queryIndex].userResult,
          this.queryList[this.queryIndex].result
        )
      ) {
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
    userQuery: {
      get: function() {
        return this.queryList[this.queryIndex].userQuery;
      },
      set: function(userQuery) {
        this.$store.commit("sql/SET_USER_QUERY", {
          userQuery,
          index: this.queryIndex
        });
      }
    },
    result() {
      return this.$store.getters["sql/getFormatedResult"](this.queryIndex);
    }
  }
};
</script>
