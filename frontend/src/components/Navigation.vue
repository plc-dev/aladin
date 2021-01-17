<template>
  <div class="navigation">
    <div class="navigation-backward" @click="swipeUp"></div>
    <div class="navigation-forward" @click="swipeDown"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";
import { store } from "../store/taskGraph";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const currentNode = computed(() => store.getters.getPropertyFromPath("currentNode"));
    const navigateGraph = (direction) => {
      let nodeIndex = currentNode.value;
      nodeIndex += direction === "forward" ? 1 : -1;
      store.dispatch("setPropertyFromPath", { path: "currentNode", value: nodeIndex });
    };

    const swipeUp = (event) => {
      if (currentNode.value === 0) {
        router.push({ name: "TaskOverview" });
      } else navigateGraph("backward");
    };
    const swipeDown = (event) => {
      navigateGraph("forward");
    };

    return { swipeDown, swipeUp };
  },
};
</script>

<style>
.navigation-backward {
  position: fixed;
  top: 0;
  height: 3vh;
  width: 300vh;
  background: linear-gradient(0deg, white 0%, rgba(90, 192, 124, 0.3) 100%);
  cursor: pointer;
  z-index: 1;
  /* https://blog.prototypr.io/stunning-hover-effects-with-css-variables-f855e7b95330
  background: radial-gradient(circle closest-side, #f32, transparent);
  transform: translate(-50%, -50%);
  transition: 20 .2s ease, 20 .2s ease; */
}
.navigation-forward {
  position: fixed;
  bottom: 0;
  height: 3vh;
  width: 300vh;
  background: linear-gradient(180deg, white 0%, rgb(228, 58, 58, 0.5) 100%);
  cursor: pointer;
  /* https://blog.prototypr.io/stunning-hover-effects-with-css-variables-f855e7b95330
  background: radial-gradient(circle closest-side, #f32, transparent);
  transform: translate(-50%, -50%);
  transition: 20 .2s ease, 20 .2s ease; */
}
</style>
