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
  background: #57636b;
  border-radius: 50%;
  color: #e8edf1;
  text-decoration: none;
  box-shadow: 2px 3px 9px 0px rgba(0, 0, 0, 1);
  text-shadow: 1px 1px 1px #b1b2b4;
  transition: all 1s ease;
}

.taskOverview_taskNode:hover {
  filter: brightness(85%);
  transition: all 1s ease;
  color: #f1ad2d;
}
</style>
