<template>
  <div class="sqlTask">
    <img
      v-if="selectedDB"
      src="/img/icons/erd.svg"
      alt="erd"
      class="show__erd"
      @click="showOverlay"
    />
    <TextBox class="description__sql">
      <template #header>{{ texts.description.header }}</template>
      <template #body><p v-html="texts.description.body"></p></template>
    </TextBox>
    <div class="sqlTask__type">
      <MultiSelectBox :name="'sql'" :selectables="selectables">
        <template #queryList>
          <div v-if="!queryList.length" v-html="texts.emptyQueryList"></div>
          <Accordion v-else class="queryList" :name="'existing'">
            <AccordionItem
              v-for="(listElement, index) in queryList"
              :key="index"
              :name="'existing'"
            >
              <template slot="header">
                {{ listElement.question }}
                <div class="accordion__icon">
                  <b>^</b>
                </div>
              </template>
              <template slot="content">
                <SqlEditor :queryIndex="index" :type="'existing'" />
              </template>
            </AccordionItem>
          </Accordion>
        </template>
        <template #generate>
          <Button
            class="sqlTask__generate--button"
            :type="'submit'"
            :text="'Generieren'"
            @click.native="generateQuery"
          >
          </Button>
          <Accordion class="queryList" :name="'generated'" :reverse="true">
            <AccordionItem
              v-for="(listElement, index) in generatedQueryList"
              :key="index"
              :name="'generated'"
            >
              <template slot="header">
                {{ listElement.question }}
                <div class="accordion__icons">
                  <div
                    class="accordion__icons--showSolution"
                    :id="`${index}`"
                    @click="showSolution"
                    v-tooltip.top="{
                      delay: {
                        show: 500,
                        hide: 100
                      },
                      content: 'Lösung anzeigen!'
                    }"
                  >
                    <b :id="`${index}`">?</b>
                  </div>
                  <div
                    class="accordion__icons--propose"
                    @click="alert"
                    v-tooltip.top="{
                      delay: {
                        show: 500,
                        hide: 100
                      },
                      content: 'Abfrage vorschlagen!'
                    }"
                  >
                    <b>+</b>
                  </div>
                  <div class="accordion__icons--open" @click="toggleCollapse">
                    <b>^</b>
                  </div>
                </div>
              </template>
              <template slot="content">
                <SqlEditor :queryIndex="index" :type="'generated'" />
              </template>
            </AccordionItem>
          </Accordion>
        </template>
      </MultiSelectBox>
    </div>

    <ScreenOverlay class="sql_overlay" />
  </div>
</template>

<style lang="postcss">
.sqlTask {
  @apply flex flex-col items-center justify-start w-full;
}

.sqlTask__type {
  @apply w-full m-4;
  max-width: 90vw;
}

.description__sql {
  @apply self-center text-center m-2 pb-4;
}

.sqlTask__generate--button {
  @apply m-auto mb-4;
}

.show__erd {
  @apply absolute cursor-pointer;
  right: 50px;
  margin-top: 20px;
  width: 50px;
  height: auto;
  z-index: 1337;
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

.sqlTask__generated--wrapper {
  width: 50vw;
}

@media (max-width: 860px) {
  .queryList {
    width: 100%;
  }

  .sqlTask__generated--wrapper {
    width: 90vw;
  }
}
</style>

<script>
import TextBox from "@/components/TextBox";
import Button from "@/components/Button";
import SqlEditor from "@/components/exercises/sql/SqlEditor";
import ScreenOverlay from "@/components/ScreenOverlay";
import MultiSelectBox from "@/components/MultiSelectBox";
import Accordion from "@/components/Accordion";
import AccordionItem from "@/components/AccordionItem";
export default {
  components: {
    TextBox,
    Button,
    ScreenOverlay,
    SqlEditor,
    MultiSelectBox,
    Accordion,
    AccordionItem
  },
  data: function() {
    return {
      selectables: [
        { title: "Bestehende Abfragen", slot: "queryList" },
        { title: "Generierte Abfragen", slot: "generate" },
        { title: "Vorgeschlagene Abfragen", slot: "propose" }
      ]
    };
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
    },
    generateQuery() {
      this.$store.dispatch("sql/generateQuery");
    },
    toggleCollapse(event) {
      let clicked =
        event.target.parentElement.parentElement.parentElement.parentElement;
      const active = document.querySelector(
        `.accordion__${this.name}--item.active`
      );
      if (!active) {
        clicked.classList.toggle("active");
        clicked.scrollIntoView({ behavior: "smooth" });
      } else if (clicked === active) active.classList.toggle("active");
      else {
        active.classList.toggle("active");
        clicked.classList.toggle("active");
        clicked.scrollIntoView({ behavior: "smooth" });
      }
    },
    alert() {
      window.alert("TODO: implement propose functionality");
    },
    showSolution(event) {
      const index = event.target.id;
      window.alert(this.generatedQueryList[index].query);
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.sql.tabs.SqlTask;
    },
    queryList: function() {
      return this.$store.state.sql.queryList;
    },
    dbList: function() {
      return this.$store.state.sql.dbList;
    },
    selectedDB: function() {
      return this.$store.state.sql.selectedDB.dbName;
    },
    generatedQueryList: function() {
      return this.$store.state.sql.generated[this.selectedDB];
    }
  },
  watch: {
    selectedDB(newDB, oldDB) {
      if (newDB !== oldDB) {
        this.getQueryList();
        Array.from(
          document.querySelectorAll(".accordion__item")
        ).forEach(listElement =>
          listElement.classList.remove("success", "error", "active")
        );
      }
    },
    generatedQueryList: {
      deep: true,
      handler(newList) {
        return newList[this.selectedDB];
      }
    }
  },
  mounted() {
    this.getQueryList();
  }
};
</script>
