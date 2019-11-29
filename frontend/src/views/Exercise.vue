<template>
  <div class="exercise">
    <div class="exercise__graph">
      <GraphOptions @ v-model="options" :options="options"></GraphOptions>
      <component class="graph" :is="exercise"></component>
    </div>
    <div class="exercise__scope">
      <div class="exercise__scope--tabs">
        <ul>
          <li
            class="tab"
            :tab="tab"
            @click="changeTab($event.target)"
            v-for="tab in tabComponents"
            :key="tab"
          >
            {{ tab }}
          </li>
        </ul>
      </div>
      <keep-alive>
        <component
          class="exercise__scope--body"
          :is="currentTabComponent"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/css/connector";
</style>
<style lang="postcss">
.exercise {
  @apply flex h-main;
}

.exercise__graph {
  @apply h-full w-1/2;
  box-shadow: inset -4px 0px 2px -2px rgba(50, 50, 50, 0.75);
}

.graph__options {
  @apply flex flex-wrap w-full;
  box-shadow: 0 4px 2px -2px rgba(50, 50, 50, 0.75);
}

.exercise__scope {
  @apply flex flex-col h-full w-1/2;
}

.exercise__scope--tabs {
  @apply flex flex-wrap w-full pt-1;
  margin: 0 auto;
  overflow: hidden;
  transition: border 250ms ease;
  box-shadow: 0 4px 2px -2px rgba(50, 50, 50, 0.75);
}

.exercise__scope--tabs ul {
  @apply m-0 p-0 float-left;
  overflow: hidden;
  padding-left: 38px;
  list-style-type: none;
}

.exercise__scope--body {
  @apply flex flex-col mt-2;
  min-height: 90%;
  overflow: auto;
}

.tab {
  @apply w-40 m-0 p-0 bg-brown_sugar text-white_chocolate cursor-pointer relative block float-right;
  padding: 10px 24px 8px;
  margin-right: 46px;
  z-index: 2;
  border-radius: 8px 8px 0 0;
  text-transform: uppercase;
  transition: all 250ms ease;
  text-shadow: rgba(0, 0, 0, 0.1) 0 1px;
}

.tab:before,
.tab:after {
  @apply top-0 h-full bg-brown_sugar absolute block;
  content: " ";
  width: 44px;
  transition: all 250ms ease;
}
.tab:before {
  right: -24px;
  transform: skew(30deg, 0deg);
  border-radius: 0 8px 0 0;
  box-shadow: rgba(0, 0, 0, 0.1) 3px 2px 5px,
    inset rgba(255, 255, 255, 0.09) -1px 0;
}
.tab:after {
  left: -24px;
  border-radius: 8px 0 0 0;
  transform: skew(-30deg, 0deg);
  box-shadow: rgba(0, 0, 0, 0.1) -3px 2px 5px,
    inset rgba(255, 255, 255, 0.09) 1px 0;
}
.tab:hover,
.tab:hover:before,
.tab:hover:after {
  @apply bg-sunray text-russet;
}
.tab.active {
  z-index: 3;
}
.tab.active,
.tab.active:before,
.tab.active:after {
  @apply bg-russet text-white_chocolate;
}

.tab.disabled {
  pointer-events: none;
  opacity: 0.6;
  background-color: none;
}
</style>

<script>
import GraphOptions from "@/components/GraphOptions";
import Exercises from "@/components/exercises/";

export default {
  name: "exercise",
  components: {
    GraphOptions,
    ...Exercises
  },
  data: function() {
    return {
      exercise: this.$route.params.exerciseName,
      currentTabComponent: ""
    };
  },
  methods: {
    changeTab(target) {
      const current = document.querySelector(".tab.active");
      if (current) {
        current.classList.remove("active");
      }
      target.classList.add("active");
      this.currentTabComponent = target.getAttribute("tab");
    }
  },
  computed: {
    options: {
      get() {
        return this.$store.getters[`${this.exercise}/getOptions`];
      },
      set(options) {
        this.$store.dispatch(`${this.exercise}/updateOptions`, options);
      }
    },
    tabComponents: function() {
      const regex = new RegExp(`${this.exercise}.*(scope|path|result)`, "i");
      return Object.keys(Exercises)
        .filter(component => regex.test(component))
        .sort((tab1, tab2) => {
          if (/scope/i.test(tab1)) {
            return true;
          }
          if (/path/i.test(tab1)) {
            if (/(result|path)/i.test(tab2)) {
              return true;
            }
          }
          return false;
        });
    }
  },
  mounted() {
    this.currentTabComponent = this.tabComponents[2];
    document.querySelector(".tab:last-child").classList.add("active");
    Array.from(
      document.querySelectorAll(".tab:not(:last-child)")
    ).forEach(tab => tab.classList.add("disabled"));
    document
      .querySelector(".graph__options .button--submit")
      .addEventListener("click", () =>
        Array.from(document.querySelectorAll(".tab.disabled")).forEach(tab =>
          tab.classList.remove("disabled")
        )
      );
  }
};
</script>
