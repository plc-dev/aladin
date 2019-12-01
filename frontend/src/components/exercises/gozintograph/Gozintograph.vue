<template>
  <div>
    <slot name="zoom"></slot>
    <div class="graph"></div>
  </div>
</template>

<style lang="postcss">
.graph {
  @apply flex flex-col flex-grow;
}

.graph__zoom {
  @apply flex justify-end mt-4 mr-4;
}

.graph_zoom button {
  @apply bg-alabama_crimson text-white_chocolate rounded-full;
  width: 50px;
  height: 50px;
}

[class^="graph__level"] {
  @apply flex justify-around;
}

.graph__level--0 {
  @apply pt-24;
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

.graph__node:hover {
}
</style>

<script>
require("@/lib/connector");
import { generateGraph } from "@/lib/gozintograph/generateGozintograph";
import { drawGozintograph } from "@/lib/gozintograph/drawGozintograph";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapMutations } = createNamespacedHelpers("gozintograph");

//@group [Gozintograph]
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      parameters: "getParameters"
    }),
    graph: function() {
      return this.$store.getters["gozintograph/getGraph"];
    }
  },
  methods: {
    ...mapMutations(["SET_GRAPH"]),
    generateGraph() {
      const graph = generateGraph(
        this.parameters.depth,
        this.parameters.rangeAmount,
        this.parameters.rangeWidth,
        this.parameters.rangeValue,
        0.5
      );
      this.SET_GRAPH(graph);
      drawGozintograph(graph);
    }
  },
  mounted() {
    if (this.graph !== undefined && this.graph.hasOwnProperty("connections")) {
      drawGozintograph(this.graph);
    }
    document
      .querySelector(".graph__options .button--submit")
      .addEventListener("click", this.generateGraph);
  }
};
</script>
