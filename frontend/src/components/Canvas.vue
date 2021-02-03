<template>
  <div class="canvas">
    <Navigation />
    <div class="zoomWrapper">
      <grid-layout
        class="grid"
        v-model="currentLayout"
        :col-num="columnAmount"
        :row-height="rowHeight"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="false"
        :use-css-transforms="false"
        :prevent-collision="true"
        @breakpoint-changed="swapLayout"
      >
        <grid-item
          v-for="item in currentLayout"
          :key="item.i"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :scale="zoomScale"
          drag-allow-from=".dragHandler"
          drag-ignore-from=".ignoreDrag"
          @resize="updateDimensions"
        >
          <img class="dragHandler" src="/img/drag_arrow.webp" />
          <component :componentID="item.i" :is="nodeComponents[item.i].type"></component>
        </grid-item>
      </grid-layout>
    </div>

    <MiniMap class="minimap" />
  </div>
</template>

<script lang="ts">
import { onMounted, computed, onUpdated, watch } from "vue";
import { store, getProperty, setProperty } from "@/helpers/TaskGraphUtility";
import { GridLayout, GridItem } from "vue-grid-layout";
import panzoom from "@panzoom/panzoom";
import MiniMap from "@/components/MiniMap.vue";
import MatrixComponent from "@/components/Matrix.vue";
import DOTGraph from "@/components/DOTGraph.vue";
import TaskConfiguration from "@/components/TaskConfiguration.vue";
import Navigation from "@/components/Navigation.vue";

export default {
  name: "Canvas",
  components: {
    MiniMap,
    MatrixComponent,
    DOTGraph,
    TaskConfiguration,
    GridItem,
    GridLayout,
    Navigation,
  },
  setup() {
    const columnAmount = 30;
    const rowHeight = (document.querySelector("html").clientWidth * 3) / columnAmount;
    const currentNode = computed(() => getProperty("currentNode"));
    const zoomScale = computed(() => getProperty("zoomScale"));
    const nodeComponents = computed(() => getProperty(`nodes__${currentNode.value}__components`));
    const layouts = computed(() => getProperty(`nodes__${currentNode.value}__layouts`));
    const layoutSize = computed(() => getProperty(`layoutSize`));
    const currentLayout = computed({
      get: () => {
        const layout = getProperty(`nodes__${currentNode.value}__layouts__${layoutSize.value}`);
        return layout;
      },
      set: (layout) => setProperty({ path: `nodes__${currentNode.value}__layout`, value: layout }),
    });

    let panzoomInstance = null;
    const setInitialDimensions = (layout, viewWidth) => {
      layout.forEach((component) =>
        setProperty({
          path: `nodes__${currentNode.value}__components__${component.i}__dimensions`,
          value: { height: component.h * rowHeight, width: component.w * (viewWidth / columnAmount) },
        })
      );
    };
    onMounted(() => {
      // - (viewwidth|viewheight * (n-1)), where n is the vw/vh specified in the zoomWrappers css
      panzoomInstance = panzoom(document.querySelector(".zoomWrapper"), {
        excludeClass: "vue-grid-item",
        canvas: true,
        contain: "outside",
        startX: -document.querySelector(".zoomWrapper").clientWidth / 2,
        startY: -document.querySelector(".zoomWrapper").clientHeight / 2,
      });
      document.querySelector(".canvas").addEventListener("wheel", (event: WheelEvent) => {
        panzoomInstance.zoomWithWheel(event);
        setProperty({ path: "zoomScale", value: panzoomInstance.getScale() });
      });

      // TODO remove hack for activating reactivity + add proper eventlisteners for resize and moving grid items
      setProperty({ path: "zoomScale", value: 1 });
    });
    const updateDimensions = (id, gridWidth, gridHeight, pixelWidth, pixelHeight) => {
      const path = `nodes__${currentNode.value}__components__${id}`;
      setProperty({ path: `${path}__dimensions`, value: { height: pixelHeight, width: pixelWidth } });
    };
    const swapLayout = (breakpoint, newlayout) => {
      // setProperty( { path: ``, value: })
    };
    watch(currentNode, () => {
      currentLayout.value = getProperty(`nodes__${currentNode.value}__layouts__${layoutSize.value}`);
    });
    return {
      layouts,
      zoomScale,
      updateDimensions,
      nodeComponents,
      swapLayout,
      currentLayout,
      columnAmount,
      rowHeight,
    };
  },
};
</script>

<style scoped>
.canvas {
  width: 100vw;
  height: 100vh;
}
.zoomWrapper {
  width: 300vw;
  height: 300vw;
}
/* GRID */
.grid {
  width: 300vw;
  min-height: 300vw;
}
.dragHandler {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  z-index: 999;
}
.vue-grid-item {
  touch-action: none;
  border: solid 1px black;
  box-sizing: border-box;
  cursor: default;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .add {
  cursor: default;
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
