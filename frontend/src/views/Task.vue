<template>
  <div class="task">
    <Canvas />
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Canvas from "@/components/Canvas.vue";
import { store } from "../store/taskGraph";

export default {
  name: "Task",
  components: {
    Canvas,
  },
  setup(props: {}) {
    const taskName = ref("");
    const route = useRoute();
    onMounted(async () => {
      if (typeof route.params.task === "string") taskName.value = route.params.task;
      await store.dispatch("fetchTaskGraph", { taskName: [taskName] });
    });
    return {};
  },
};
</script>
