<template>
  <div class="taskOverview">
    <div class="center node">ALADIN</div>
    <router-link class="taskOverview_taskNode node" v-for="task in taskList" :key="task.name" :to="`/task/${task.name}`">{{
      task.name
    }}</router-link>
  </div>
</template>

<script lang="ts">
import { computed, onMounted } from "vue";
import { store } from "../store/taskOverview";

export default {
  setup() {
    const taskList = computed(() => {
      return store.state.taskList;
    });

    const circularLayout = (circleElements, spread = 300) => {
      const elementSize = circleElements[0].offsetWidth / 2;

      const centerX = window.innerWidth / 2 - elementSize;
      const centerY = window.innerHeight / 2 - elementSize;

      const increase = (Math.PI * 2) / circleElements.length;

      let x = 0,
        y = 0,
        angle = 0;

      circleElements.forEach((element) => {
        x = spread * Math.cos(angle) + centerX;
        y = spread * Math.sin(angle) + centerY;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        angle += increase;
      });
    };

    const centreElement = (element) => {
      const elementSize = element.offsetWidth / 2;

      const x = window.innerWidth / 2 - elementSize;
      const y = window.innerHeight / 2 - elementSize;

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    };

    onMounted(() => {
      const circleElements = Array.from(document.querySelectorAll(".taskOverview_taskNode"));
      circularLayout(circleElements);

      const centerNode = document.querySelector(".center");
      centreElement(centerNode);
    });

    return { taskList };
  },
};
</script>

<style scoped>
.taskOverview {
  width: 100vw;
  height: 100vh;
}

.node {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 8vw;
  width: 8vw;
  background: #57636b;
  border-radius: 50%;
<<<<<<< HEAD
  text-decoration: none;
  box-shadow: 2px 3px 9px 0px rgba(0, 0, 0, 1);
  text-shadow: 1px 1px 1px #b1b2b4;
  font-size: 18px;
}

.center {
  height: 9vw;
  width: 9vw;
  color: #f1ad2d;
  font-size: 20px;
}

.taskOverview_taskNode {
  transition: all 0.5s ease;
  background: #e8edf1;
  filter: brightness(70%);
  color: #57636b;
=======
  color: #e8edf1;
  text-decoration: none;
  box-shadow: 2px 3px 9px 0px rgba(0, 0, 0, 1);
  text-shadow: 1px 1px 1px #b1b2b4;
  transition: all 1s ease;
>>>>>>> origin/master
}

.taskOverview_taskNode:hover {
  filter: brightness(85%);
<<<<<<< HEAD
  transition: all 0.5s ease;
  color: #f1ad2d;
  font-size: 20px;
  transform: scale(1.02);
  background: #57636b;
=======
  transition: all 1s ease;
  color: #f1ad2d;
>>>>>>> origin/master
}
</style>
