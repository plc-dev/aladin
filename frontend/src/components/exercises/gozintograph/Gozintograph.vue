<template>
  <div></div>
</template>

<style lang="postcss">
.graph {
  @apply flex flex-col flex-grow;
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
  @apply visible text-center text-regalia text-4xl;
}

.line:hover .edgeValue {
  @apply text-center text-regalia text-4xl;
}

.graph__node:hover {
}
</style>

<script>
require("@/lib/connector");
import { collisionDetection } from "@/lib/helper";
import { generateGraph } from "@/lib/gozintograph/generateGozintograph";
import {
  drawNodes,
  drawConnections
} from "@/lib/gozintograph/drawGozintograph";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapMutations } = createNamespacedHelpers("gozintograph");
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      parameters: "getParameters"
    })
  },
  methods: {
    ...mapMutations(["SET_GRAPH"]),
    gen() {
      document.querySelector(".graph").innerHTML = "";
      const graph = generateGraph(
        this.parameters.depth,
        this.parameters.rangeAmount,
        this.parameters.rangeWidth,
        this.parameters.rangeValue,
        0.5
      );
      this.SET_GRAPH(graph);
      graph.level.forEach((nodes, level, levels) =>
        drawNodes(nodes, level, levels.length)
      );
      drawConnections(graph.connections);
      setTimeout(() => {
        collisionDetection(
          Array.from(document.querySelectorAll(".edgeValue")),
          node => (node.classList += " showOnHover"),
          Array.from(document.querySelectorAll(".graph__node"))
        );
      }, 50);
    }
  },
  mounted() {
    document
      .querySelector(".graph__options .button--submit")
      .addEventListener("click", this.gen);
  }
};
</script>
