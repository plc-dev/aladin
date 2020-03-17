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
          <div
            v-if="!existingQueryList.length"
            v-html="texts.emptyQueryList"
          ></div>
          <Accordion v-else class="queryList" :name="'existing'">
            <AccordionItem
              v-for="(listElement, index) in existingQueryList"
              :key="index"
              :name="'existing'"
            >
              <template slot="header">
                {{ listElement.question }}
                <div class="accordion__icons">
                  <div
                    class="accordion__icons--showSolution"
                    :id="`existing_${index}`"
                    @click="showSolution"
                    v-tooltip.top="{
                      delay: {
                        show: 500,
                        hide: 100
                      },
                      content: texts.tooltips.showSolution
                    }"
                  >
                    <b :id="`existing_${index}`">?</b>
                  </div>
                  <div class="accordion__icons--open" @click="toggleCollapse">
                    <b>^</b>
                  </div>
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
            :text="texts.buttons.generateQuery"
            @click.native="generateQuery"
          >
          </Button>
          <Accordion class="queryList" :name="'generated'" :reverse="true">
            <AccordionItem
              v-for="(listElement, index) in generatedQueryList"
              :key="`generated_${index}`"
              :name="'generated'"
            >
              <template slot="header">
                {{ listElement.question }}
                <div class="accordion__icons">
                  <div
                    class="accordion__icons--showSolution"
                    :id="`generated_${index}`"
                    @click="showSolution"
                    v-tooltip.top="{
                      delay: {
                        show: 500,
                        hide: 100
                      },
                      content: texts.tooltips.showSolution
                    }"
                  >
                    <b :id="`generated_${index}`">?</b>
                  </div>
                  <div
                    class="accordion__icons--propose"
                    :id="`generated_${index}`"
                    @click="proposeQuery"
                    v-tooltip.top="{
                      delay: {
                        show: 500,
                        hide: 100
                      },
                      content: texts.tooltips.proposeQuery
                    }"
                  >
                    <b :id="`generated_${index}`">+</b>
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
        <template #propose>
          <div
            v-if="!proposedQueryList.length"
            v-html="texts.emptyQueryList"
          ></div>
          <Accordion v-else class="queryList" :name="'proposed'">
            <AccordionItem
              v-for="(listElement, index) in proposedQueryList"
              :key="index"
              :name="'proposed'"
            >
              <template slot="header">
                {{ listElement.question }}
                <div class="accordion__icons">
                  <div
                    class="accordion__icons--showSolution"
                    :id="`proposed_${index}`"
                    @click="showSolution"
                    v-tooltip.top="{
                      delay: {
                        show: 500,
                        hide: 100
                      },
                      content: texts.tooltips.showSolution
                    }"
                  >
                    <b :id="`proposed_${index}`">?</b>
                  </div>
                  <div class="accordion__icons--open" @click="toggleCollapse">
                    <b>^</b>
                  </div>
                </div>
              </template>
              <template slot="content">
                <SqlEditor :queryIndex="index" :type="'proposed'" />
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

.popup__propose {
  @apply flex;
}

.popup__propose--text {
  @apply bg-background p-1;
  border-radius: 5px;
  min-width: 300px;
  min-height: 100px;
  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.34);
}

.popup__propose--difficulty {
  @apply flex flex-col ml-5;
}

.popup__propose--difficulty > div {
  height: 50px;
  width: 100px;
  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.34);
}

.popup__propose--difficulty > .easy {
  @apply bg-success;
  border-radius: 5px 5px 0 0;
}

.popup__propose--difficulty > .medium {
  @apply bg-highlight;
}

.popup__propose--difficulty > .hard {
  @apply bg-alabama_crimson;
  border-radius: 0 0 5px 5px;
}

.popup__propose--difficulty .chosen {
  border: 2px solid rgb(99, 96, 96);
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
  methods: {
    getQueryLists() {
      this.$store.dispatch("sql/getQueryLists");
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
    proposeQuery(event) {
      const difficultyListener = event => {
        const current = document.querySelector(
          ".popup__propose--difficulty .chosen"
        );
        if (current) current.classList.remove("chosen");
        event.target.classList.add("chosen");
        toggleDisable();
      };
      const proposedQueryListener = () => toggleDisable();
      this.$alertify
        .confirm(
          "<div class='popup__propose'> " +
            `<textarea class='popup__propose--text' placeholder='${this.texts.popup.placeholder}'></textarea>` +
            "<div class='popup__propose--difficulty'> <div class='easy'></div> <div class='medium'></div> <div class='hard'></div> </div>" +
            "</div>",
          () => {
            const [, index] = event.target.id.match(/_([0-9]+)/);

            const semanticQuery = document.querySelector(
              ".popup__propose--text"
            ).value;

            const chosenDifficulty = document.querySelector(
              ".popup__propose--difficulty .chosen"
            ).classList[0];

            this.$store.dispatch("sql/proposeQuery", {
              query: this.generatedQueryList[index].query,
              question: semanticQuery,
              difficulty: chosenDifficulty
            });
            document.querySelector(".popup__propose--text").value = "";
            document
              .querySelector(".popup__propose--difficulty .chosen")
              .classList.remove("chosen");
            document
              .querySelector(".popup__propose--text")
              .removeEventListener("click", proposedQueryListener);
            Array.from(
              document.querySelectorAll(".popup__propose--difficulty > div")
            ).forEach(node =>
              node.removeEventListener("click", difficultyListener)
            );
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          },
          () => {
            document
              .querySelector(".popup__propose--text")
              .removeEventListener("click", proposedQueryListener);

            Array.from(
              document.querySelectorAll(".popup__propose--difficulty > div")
            ).forEach(node =>
              node.removeEventListener("click", difficultyListener)
            );

            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          }
        )
        .set({ title: "Schlage diese Abfrage anderen vor!" })
        .set({
          labels: {
            ok: "Vorschlagen",
            cancel: "Abbrechen"
          }
        });
      const difficulties = Array.from(
        document.querySelectorAll(".popup__propose--difficulty > div")
      );
      difficulties.forEach(node =>
        node.addEventListener("click", difficultyListener)
      );
      const proposedQuery = document.querySelector(".popup__propose--text");
      proposedQuery.addEventListener("keydown", proposedQueryListener);

      const toggleDisable = () => {
        const semanticQuery = document.querySelector(".popup__propose--text")
          .value;
        const chosenDifficulty = document.querySelectorAll(
          ".popup__propose--difficulty .chosen"
        ).length
          ? document.querySelector(".popup__propose--difficulty .chosen")
              .classList[0]
          : false;
        const confirmButton = document.querySelector(".ajs-button.ajs-ok");
        if (!semanticQuery | !chosenDifficulty)
          confirmButton.setAttribute("disabled", true);
        else confirmButton.removeAttribute("disabled");
      };
      toggleDisable();
    },
    showSolution(event) {
      console.warn(event.target.id);
      const [, type, index] = event.target.id.match(/(\w+)_([0-9]+)/);
      this[`${type}QueryList`][index].userQuery = this[`${type}QueryList`][
        index
      ].query
        .split(/(FROM|GROUP BY|ORDER BY|WHERE)/gi)
        .join("\n")
        .replace(/(FROM|GROUP BY|ORDER BY|WHERE)\n/gi, "$1");
      const queryHeader = document.getElementById(`${type}_${index}`)
        .parentElement.parentElement;
      if (!queryHeader.parentElement.classList.contains("active")) {
        queryHeader.click();
      }

      queryHeader.nextSibling.querySelector(".CodeMirror-scroll").focus();
      queryHeader.scrollIntoView({ behavior: "smooth" });
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts.exercises.sql.tabs.SqlTask;
      return {
        description: texts.description,
        listType: texts.listType,
        tooltips: texts.tooltips,
        buttons: texts.buttons,
        popup: texts.popup
      };
    },
    selectables: function() {
      return [
        { title: this.texts.listType.existing, slot: "queryList" },
        { title: this.texts.listType.generated, slot: "generate" },
        { title: this.texts.listType.proposed, slot: "propose" }
      ];
    },
    existingQueryList: function() {
      return this.$store.state.sql.existingQueryList;
    },
    dbList: function() {
      return this.$store.state.sql.dbList;
    },
    selectedDB: function() {
      return this.$store.state.sql.selectedDB.dbName;
    },
    generatedQueryList: function() {
      return this.$store.state.sql.generatedQueryList[this.selectedDB];
    },
    proposedQueryList: function() {
      return this.$store.state.sql.proposedQueryList;
    }
  },
  watch: {
    selectedDB(newDB, oldDB) {
      if (newDB !== oldDB) {
        this.getQueryLists();
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
    this.getQueryLists();
  }
};
</script>
