<template>
  <div class="dotGraph" :id="`graph_${id}`"></div>
</template>

<script lang="ts">
import { onMounted, computed, toRefs, ref, defineComponent, watch } from "vue";
import { graphviz } from "d3-graphviz";
import { store, getProperty } from "@/helpers/TaskGraphUtility";

export default {
  props: {
    componentID: Number,
  },
  setup(props: { componentID: number }) {
    const currentNode = computed(() => store.state.currentNode);
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const dependencyPath = getProperty(`nodes__${currentNode.value}__components__${props.componentID}__dependency`);
    const dependency = computed(() => {
      const dependency = getProperty(`${dependencyPath}`);
      if (!dependency) return "";
      return dependency;
    });

    const renderGraph = (description) => {
      graphviz(`#graph_${props.componentID}`, {
        fit: true,
        zoom: false,
        useWorker: false,
      }).renderDot(description);
    };
    watch(dependency, () => {
      renderGraph(dependency.value);
    });
    onMounted(() => {
      renderGraph(dependency.value);
    });
    return { id: props.componentID };
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
