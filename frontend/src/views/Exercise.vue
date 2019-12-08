<template>
  <div class="exercise">
    <div class="exercise__scope">
      <ul class="exercise__scope--tabs">
        <li
          class="tab"
          :tab="tab"
          @click="changeTab($event.target)"
          v-for="tab in tabComponents"
          :key="tab"
        >
          {{ texts[exercise].tabs[tab].tab }}
        </li>
      </ul>
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

.exercise__scope {
  @apply flex flex-col h-full w-full;
}

.exercise__scope--body {
  @apply flex w-full h-full;
  overflow: auto;
}

.exercise__scope--tabs {
  @apply flex flex-wrap w-full bg-main;
  box-shadow: 0 4px 2px -2px rgba(50, 50, 50, 0.75);
  z-index: 10;
}

.tab {
  @apply flex-grow text-center py-1 bg-main text-contrast mx-1 rounded border border-main  cursor-pointer;
}

.tab:hover {
  @apply bg-highlight;
}

.tab.active {
  @apply bg-contrast text-highlight;
}

.tab.disabled {
  pointer-events: none;
  opacity: 0.6;
  background-color: none;
}
</style>

<script>
import Exercises from "@/components/exercises/";

export default {
  name: "Exercise",
  components: {
    ...Exercises
  },
  data: function() {
    return {
      exercise: this.$route.params.exerciseName,
      currentTabComponent: this.currentTab
    };
  },
  methods: {
    changeTab(target) {
      const current = document.querySelector(".tab.active");
      if (current) {
        current.classList.remove("active");
      }
      target.classList.add("active");
      const tab = target.getAttribute("tab");
      this.currentTabComponent = tab;
      this.$store.commit(`${this.exercise}/SET_CURRENT_TAB`, tab);
    }
  },
  computed: {
    currentTab: function() {
      const exercise = this.$store.state[this.exercise];
      if (!exercise) return exercise;
      return exercise.currentTab;
    },
    tabComponents: function() {
      const regex = new RegExp(
        `(^${this.exercisse}$|${this.exercise}.*(task|scope|path))`,
        "i"
      );
      return Object.keys(Exercises)
        .filter(component => regex.test(component))
        .sort((tab1, tab2) => {
          if (/scope/i.test(tab1)) {
            return -1;
          }
          if (/task/i.test(tab1)) {
            if (/path/i.test(tab2)) {
              return -1;
            }
          }
          return 1;
        });
    },
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises;
    }
  },
  mounted() {
    // remember currentTab
    if (this.currentTab) {
      document
        .querySelector(`[tab="${this.currentTab}"]`)
        .classList.add("active");
      this.currentTabComponent = this.currentTab;
      // or set tab initially
    } else {
      const tabs = this.tabComponents;
      if (!tabs.length) this.$router.push("/404");
      this.currentTabComponent = tabs[0];
      document.querySelector(".tab:first-child").classList.add("active");
      Array.from(
        document.querySelectorAll(".tab:not(:first-child):not(:nth-child(2))")
      ).forEach(tab => tab.classList.add("disabled"));
    }
  }
};
</script>
