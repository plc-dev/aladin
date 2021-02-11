<template>
  <div class="traversal">
    <DOTGraph :componentID="componentID" :storeObject="storeObject" />
  </div>
</template>

<script lang="ts">
import { onMounted, computed } from "vue";
import DOTGraph from "@/components/taskComponents/DOTGraph.vue";

export default {
  components: { DOTGraph },
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));

    const dependencies = getProperty(`nodes__${currentNode.value}__components__${props.componentID}__dependencies`);
    const dependency = computed(() => {
      const dependency: object = getProperty(`${dependencies["VisualGraphTraversal"]}`);
      if (!dependency) return {};
      return Object.values(dependency).reduce((nodes, node) => {
        if (Object.keys(node).includes("label")) nodes[node.label] = node;
        return nodes;
      }, {});
    });

    const handleSelectedPath = (event) => {
      const edge = event.currentTarget;
      const [complete, parentNode, childNode] = edge.querySelector("title").textContent.match(/(.*)->(.*)/);
      const weight = edge.querySelector("text").textContent;

      console.log(dependency.value);
    };

    onMounted(() => {
      let edges = document.querySelectorAll(".traversal .edge");
      const pollGraph = setInterval(() => {
        edges = document.querySelectorAll(".traversal .edge");

        if (edges.length) {
          clearInterval(pollGraph);
          Array.from(edges).forEach((edge) => edge.addEventListener("click", handleSelectedPath));
        }
      }, 500);
    });
    return {};
  },
};
</script>

<style scoped>
.traversal {
  width: 100%;
  height: 100%;
}

.traversal .edge {
  cursor: pointer;
}
</style>
