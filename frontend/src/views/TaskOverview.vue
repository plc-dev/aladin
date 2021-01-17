<template>
  <div class="taskOverview">
    <router-link class="taskOverview_taskNode" v-for="task in taskList" :key="task.name" :to="`/task/${task.name}`">{{
      task.name
    }}</router-link>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { store } from "../store/taskOverview";

export default {
  setup() {
    const taskList = computed(() => {
      return store.state.taskList;
    });
    return { taskList };
  },
};
</script>

<style>
.taskOverview {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 100vh;
}

.taskOverview_taskNode {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8vw;
  width: 8vw;
  background: grey;
  border-radius: 50%;
}
</style>
