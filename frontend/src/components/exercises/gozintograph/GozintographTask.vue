<template>
  <div class="graph__wrapper">
    <GraphOptions v-if="!hidden" v-model="options" :options="options">
      <template #header>
        <div class="graph__options--header">
          {{ header }}
          <div class="graph__options--hide" @click="toggleOptions">&Lt;</div>
        </div>
      </template>
      <template #buttons>
        <Button :text="text" @click.native="generateGraph()"></Button>
      </template>
    </GraphOptions>
    <div class="graph__options--hidden" v-else>
      <div @click="toggleOptions">&Gt;</div>
    </div>
    <div class="graph"></div>
  </div>
</template>

<style lang="postcss">
.graph__wrapper {
  @apply flex;
  overflow: auto;
}

.graph__options {
  @apply flex flex-col h-full justify-between items-center text-center overflow-y-auto;
  box-shadow: 5px 0 5px -5px #333;
}

.graph__options--header {
  @apply flex justify-around bg-contrast text-background w-full p-1;
}

.graph__options--hide {
  @apply text-background border border-background border-solid px-2 w-6 h-6 flex items-center justify-center cursor-pointer;
}

.graph__options--hide:hover {
  @apply text-highlight border-highlight;
}

.graph__options--hidden {
  @apply h-full w-8 bg-contrast flex justify-center;
  box-shadow: 5px 0 5px -5px #333;
}

.graph__options--hidden > div {
  @apply flex text-background border border-background border-solid px-1 mt-2 w-6 h-6 items-center justify-center cursor-pointer;
}

.graph__options--hidden > div:hover {
  @apply text-highlight border-highlight;
}

.graph {
  @apply flex flex-col w-full;
}

[class^="graph__level"] {
  @apply flex justify-around items-center;
}

.graph__node {
  @apply h-nodes w-nodes rounded-full bg-alabama_crimson;
  text-align: center;
  line-height: 50px;
  color: white;
}

.graph__node--value {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  color: white;
}

.showOnHover {
  @apply invisible;
}

.line:hover .showOnHover {
  @apply visible text-center text-russet text-4xl;
}

.line:hover .edgeValue {
  @apply text-center text-russet text-4xl;
}
</style>

<script>
require("@/lib/connector");
import { generateGraph } from "@/lib/gozintograph/generateGozintograph";
import { drawGozintograph } from "@/lib/gozintograph/drawGozintograph";
import GraphOptions from "@/components/GraphOptions";
import Button from "@/components/Button";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("gozintograph");

//@group [Gozintograph]
export default {
  components: {
    GraphOptions,
    Button
  },
  data() {
    return {
      hidden: false
    };
  },
  computed: {
    ...mapGetters({
      parameters: "getParameters"
    }),
    graph: function() {
      return this.$store.getters["gozintograph/getGraph"];
    },
    options: {
      get() {
        return this.$store.getters[`gozintograph/getOptions`];
      },
      set(options) {
        this.$store.dispatch(`gozintograph/updateOptions`, options);
      }
    },
    text: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.options.button;
    },
    header: function() {
      return this.$store.state.user.texts.exercises.gozintograph.options.header;
    }
  },
  methods: {
    ...mapActions(["setGraph"]),
    generateGraph() {
      const graph = generateGraph(
        this.parameters.depth,
        this.parameters.rangeAmount,
        this.parameters.rangeWidth,
        this.parameters.rangeValue,
        this.parameters.connectionThreshold
      );
      this.setGraph(graph);

      const appendTo = document.querySelector(".graph");
      const containerHeight = document.querySelector(".exercise").offsetHeight;
      drawGozintograph(graph, appendTo, containerHeight);

      // render tabs active
      Array.from(document.querySelectorAll(".tab.disabled")).forEach(tab =>
        tab.classList.remove("disabled")
      );
    },
    toggleOptions() {
      this.hidden = !this.hidden;
      const appendTo = document.querySelector(".graph");
      const containerHeight = document.querySelector(".exercise").offsetHeight;
      if (Object.keys(this.graph).length) {
        drawGozintograph(this.graph, appendTo, containerHeight);
      }
    }
  },
  mounted() {
    if (this.graph !== undefined && this.graph.hasOwnProperty("connections")) {
      const appendTo = document.querySelector(".graph");
      const containerHeight = document.querySelector(".exercise").offsetHeight;
      drawGozintograph(this.graph, appendTo, containerHeight);
    }
  }
};
</script>
