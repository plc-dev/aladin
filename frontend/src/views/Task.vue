<template>
  <div class="task">
    <DecisionNode v-if="isDecisionNode" />
    <Canvas v-else :key="currentNode" />
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import Canvas from "@/components/Canvas.vue";
import { store } from "../store/taskGraph";
import DecisionNode from "@/components/DecisionNode.vue";

export default {
  name: "Task",
  components: {
    Canvas,
    DecisionNode,
  },
  setup(props: {}) {
    const taskName = ref("");
    const route = useRoute();
    const currentNode = computed(() => store.getters.getPropertyFromPath("currentNode"));
    const isDecisionNode = computed(() => store.getters.getPropertyFromPath(`edges__${currentNode.value}`).length > 1);
    onMounted(async () => {
      if (typeof route.params.task === "string") taskName.value = route.params.task;
      await store.dispatch("fetchTaskGraph", { taskName: [taskName] });
    });
    return { currentNode, isDecisionNode };
  },
};
</script>
