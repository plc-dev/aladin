<template>
  <div class="description">
    <img
      src="/img/icons/erd.svg"
      alt="erd"
      class="show__erd"
      @click="showOverlay"
    />
    <TextBox class="description__sql">
      <template #header>{{ texts.description.header }}</template>
      <template #body><p v-html="texts.description.body"></p></template>
    </TextBox>
    <Accordion class="queryList" :name="'queryList'">
      <AccordionItem
        v-for="(listElement, index) in queryList"
        :key="index"
        :name="'queryList'"
      >
        <template slot="header">
          {{ listElement.question }}
          <div class="accordion__icon"><b>^</b></div>
        </template>
        <template slot="content"><SqlEditor :queryIndex="index"/></template>
      </AccordionItem>
    </Accordion>

    <ScreenOverlay class="sql_overlay" />
  </div>
</template>

<style lang="postcss">
.description {
  @apply flex flex-col items-center justify-start w-full;
}

.description__sql {
  @apply self-center text-center m-2 pb-4;
}

.show__erd {
  @apply absolute cursor-pointer;
  right: 50px;
  margin-top: 20px;
  width: 50px;
  height: auto;
}

.sql_overlay .overlay__content {
  @apply flex justify-center items-center;
}

.erd__overlay {
  opacity: 80%;
  max-height: 100vh;
  max-width: 100vw;
}

.queryList {
  @apply flex justify-center items-center;
  width: 46%;
}

.faq {
  @apply mb-8;
}

@media (max-width: 860px) {
  .queryList {
    width: 100%;
  }
}
</style>

<script>
import TextBox from "@/components/TextBox";
import SqlEditor from "@/components/exercises/sql/SqlEditor";
import ScreenOverlay from "@/components/ScreenOverlay";
import Accordion from "@/components/Accordion";
import AccordionItem from "@/components/AccordionItem";
export default {
  components: {
    TextBox,
    ScreenOverlay,
    SqlEditor,
    Accordion,
    AccordionItem
  },
  methods: {
    getQueryList() {
      this.$store.dispatch("sql/getQueryList");
    },
    showOverlay() {
      document.querySelector(".overlay").style.height = "100vh";
      const erd = document.createElement("img");
      erd.classList += "erd__overlay";
      erd.src = this.dbList[this.$store.state.sql.selectedDB.index].img;
      document.querySelector(".overlay__content").innerHTML = "";
      document.querySelector(".overlay__content").appendChild(erd);
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.sql.tabs.SqlGraphPath;
    },
    queryList: function() {
      return this.$store.state.sql.queryList;
    },
    dbList: function() {
      return this.$store.state.sql.dbList;
    },
    selectedDB: function() {
      return this.$store.state.sql.selectedDB.dbName;
    }
  },
  watch: {
    selectedDB(newDB, oldDB) {
      if (newDB !== oldDB) {
        this.getQueryList();
      }
    }
  },
  mounted() {
    this.getQueryList();
  }
};
</script>
