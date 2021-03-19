<template>
  <div class="dotGraph" :id="`graph_${componentID}`"></div>
</template>

<script lang="ts">
import { onMounted, computed, ref, defineComponent, watch } from "vue";
import { graphviz } from "d3-graphviz";

export default {
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { store, getProperty } = props.storeObject;
    const currentNode = computed(() => store.state.currentNode);
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const dependencies = getProperty(`${path}__dependencies`);
    const dotDescription = computed(() => {
      const dotDescription = getProperty(dependencies.DOTGraph.dotDescription);
      if (!dotDescription) return "";
      return dotDescription;
    });

    const renderGraph = (description) => {
      graphviz(`#graph_${props.componentID}`, {
        fit: true,
        zoom: false,
        useWorker: false,
      }).renderDot(description);
    };
    watch(dotDescription, () => {
      console.log(dotDescription.value);
      renderGraph(dotDescription.value);
    });
    onMounted(() => {
      renderGraph(dotDescription.value);
      const pollForGraph = setInterval(() => {
        let background = document.querySelector(".dotGraph polygon");
        if (background) {
          clearInterval(pollForGraph);
          background.setAttribute("fill", "transparent");
        }
      }, 50);
    });
    return {};
  },
};
</script>

<style>
.dotGraph {
  display: flex;
  justify-items: center;
  align-content: center;
  width: 100%;
  height: 100%;
}

.dotGraph > svg {
  display: flex;
  justify-items: center;
  align-content: center;
  width: 100%;
  height: 100%;
}

.graph {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
