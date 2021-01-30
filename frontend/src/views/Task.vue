<template>
  <div class="task">
    <DecisionNode v-if="isDecisionNode" />
    <Canvas v-if="!isDecisionNode && isLoaded" :key="currentNode" />
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import Canvas from "@/components/Canvas.vue";
import { store, getProperty, setProperty } from "@/helpers/TaskGraphUtility";
import DecisionNode from "@/components/DecisionNode.vue";

export default {
  name: "Task",
  components: {
    Canvas,
    DecisionNode,
  },
  setup() {
    const route = useRoute();
    const currentNode = computed(() => getProperty("currentNode"));
    const isDecisionNode = computed(() => {
      const edges = getProperty(`edges__${currentNode.value}`);
      if (edges) return edges.length > 1;
      return false;
    });

    const isLoaded = computed(() => getProperty(`currentNode`));

    if (typeof route.params.task === "string") {
      setProperty({ path: "currentTask", value: route.params.task });
      store.dispatch("fetchTaskGraph", { task: route.params.task });
    }
    onMounted(async () => {});
    return { currentNode, isDecisionNode, isLoaded };
  },
};
</script>
