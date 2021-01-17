<template>
  <div class="dotGraph" :id="`graph_${id}`"></div>
</template>

<script lang="ts">
import { onMounted, computed, toRefs, ref, defineComponent, watch } from "vue";
import { graphviz } from "d3-graphviz";
import { store } from "../store/taskGraph";

export default {
  props: {
    componentID: Number,
  },
  setup(props: { componentID: number }) {
    const currentNode = computed(() => store.state.currentNode);
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;
    const component = computed(() => store.getters.getPropertyFromPath(path));

    const taskData = computed(() => store.getters.getPropertyFromPath("taskData"));

    const renderGraph = (description) => {
      graphviz(`#graph_${props.componentID}`, {
        height: component.value.height,
        width: component.value.width,
        fit: true,
        zoom: false,
        useWorker: false,
      }).renderDot(description);
    };
    watch(taskData, () => {
      renderGraph(taskData.value.dotDescription);
    });
    onMounted(() => {
      renderGraph(component.value.component.dotDescription);
    });
    return { component, id: props.componentID };
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
