<template>
  <div class="task">
    <DecisionNode v-if="isDecisionNode" :storeObject="taskStore" />
    <Canvas v-if="!isDecisionNode && isLoaded" :key="currentNode" :storeObject="taskStore" />
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Canvas from "@/components/Canvas.vue";
import stores from "@/helpers/TaskGraphUtility";
import DecisionNode from "@/components/DecisionNode.vue";

export default {
  name: "Task",
  components: {
    Canvas,
    DecisionNode,
  },
  setup() {
    const taskStore = stores.taskStore;
    const { store, getProperty, setProperty } = taskStore;

    const route = useRoute();
    const currentNode = computed(() => getProperty("currentNode"));
    const isDecisionNode = computed(() => {
      const edges = getProperty(`edges__${currentNode.value}`);
      if (edges) return edges.length > 1;
      return false;
    });

    const isLoaded = computed(() => getProperty(`currentNode`) !== null);

    if (typeof route.params.task === "string") {
      setProperty({ path: "currentTask", value: route.params.task });
      store.dispatch("fetchTaskGraph", { task: route.params.task });
    }
    return { currentNode, isDecisionNode, isLoaded, taskStore };
  },
};
</script>
