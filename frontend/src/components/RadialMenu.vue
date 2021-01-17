<template>
  <div class="radialMenu node">
    <div class="node" v-for="(menuItem, i) in menuItems" :key="i">{{ menuItem }}</div>
  </div>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";
import { store } from "../store/taskGraph";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const menuItems = ["adawdwa", "sad"];

    const onClick = () => {
      router.push({ name: "TaskOverview" });
    };

    const menuTree = {
      root: {
        level: 0,
        childs: [1, 2, 3],
      },
    };

    return { menuItems, onClick };
  },
};
</script>

<style>
.radialMenu {
  position: fixed;
  z-index: 999999999;
  top: 20px;
  left: 20px;
  cursor: pointer;
}

.node {
  border-radius: 50%;
  background: red;
  width: 50px;
  height: 50px;
}
</style>
