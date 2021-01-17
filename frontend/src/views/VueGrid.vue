<template>
  <grid-layout
    v-model="layout"
    :col-num="12"
    :row-height="30"
    :is-draggable="draggable"
    :is-resizable="resizable"
    :vertical-compact="false"
    :use-css-transforms="true"
  >
    <grid-item
      v-for="(item, i) in layout"
      :key="item.i"
      :static="item.static"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      drag-allow-from=".dragHandler"
      drag-ignore-from=".ignoreDrag"
    >
      <img class="dragHandler" src="img/drag_arrow.webp" />
      <component class="ignoreDrag" :class="`component_${i}`" :is="'DOTGraph'"></component>
    </grid-item>
  </grid-layout>
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import DOTGraph from "@/components/DOTGraph.vue";
export default {
  components: {
    GridLayout,
    GridItem,
    DOTGraph,
  },
  data() {
    return {
      layout: [
        { x: 8, y: 2, w: 5, h: 6, i: "4", static: false },
        { x: 10, y: 0, w: 2, h: 3, i: "5", static: false },
        { x: 0, y: 5, w: 2, h: 5, i: "6", static: false },
        { x: 2, y: 5, w: 2, h: 5, i: "7", static: false },
        { x: 4, y: 5, w: 2, h: 5, i: "8", static: false },
        { x: 6, y: 3, w: 2, h: 4, i: "9", static: false },
        { x: 8, y: 4, w: 2, h: 4, i: "10", static: false },
        { x: 4, y: 8, w: 2, h: 4, i: "14", static: false },
        { x: 6, y: 8, w: 2, h: 4, i: "15", static: false },
        { x: 8, y: 10, w: 2, h: 5, i: "16", static: false },
        { x: 10, y: 4, w: 2, h: 2, i: "17", static: false },
        { x: 0, y: 9, w: 2, h: 3, i: "18", static: false },
        { x: 2, y: 6, w: 2, h: 2, i: "19", static: false },
      ],
      draggable: true,
      resizable: true,
      index: 0,
    };
  },
  methods: {
    itemTitle(item) {
      let result = item.i;
      if (item.static) {
        result += " - Static";
      }
      return result;
    },
  },
};
</script>

<style scoped>
.dragHandler {
  position: absolute;
  width: 20px;
  height: 20px;
}

.vue-grid-layout {
  background: #eee;
  min-height: 100vh;
  min-width: 100vw;
}
.vue-grid-item {
  touch-action: none;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: #eee;
  border: 1px solid black;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
