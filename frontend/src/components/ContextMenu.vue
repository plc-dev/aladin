<template>
  <div class="wrapper" @clickout.prevent="closeContextMenu" @contextmenu.prevent="openContextMenu">
    <slot></slot>
    <div :class="`contextMenu contextMenu_${id}`">
      <div v-for="(method, name) in componentMethods" :key="name" @click="method">{{ name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { getProperty } from "@/helpers/TaskGraphUtility";
import { ref } from "vue";
require("clickout-event");

export default {
  name: "ContextMenu",
  props: { componentId: Number, methods: Object },
  setup(props) {
    const currentNode = getProperty("currentNode");

    const closeContextMenu = () => {
      const contextMenu = document.querySelector(".contextMenu.open");
      if (contextMenu) contextMenu.classList.remove("open");
    };
    const openContextMenu = (event) => {
      const parent = event.path.filter((n) => /vue-grid-item/.test(n.className))[0];
      const contextMenu: HTMLElement = document.querySelector(`.contextMenu_${props.componentId}`);
      // contextMenu.style.left = `${parent.style.left.match(/\d*/)[0] - event.pageX}px`;
      // contextMenu.style.top = `${parent.style.top.match(/\d*/)[0] - event.pageY}px`;
      contextMenu.classList.add("open");
    };

    return { componentMethods: props.methods, id: props.componentId, openContextMenu, closeContextMenu };
  },
};
</script>

<style scoped>
.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}

.contextMenu {
  display: hidden;
  background: lightgrey;
}

.contextMenu.open {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 5;
  font-size: 20px;
  cursor: pointer;
  border: 1px solid black;
}

.contextMenu.open div {
  border: 1px solid black;
  width: 100%;
}
</style>
