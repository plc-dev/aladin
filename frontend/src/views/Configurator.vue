<template>
  <div class="editor">
    <JSONEditor :storeObject="configurationStore" />
    <DecisionNode v-if="isDecisionNode" :storeObject="configurationStore" />
    <Canvas v-if="!isDecisionNode && Number.isInteger(currentNode)" :key="currentNode" :storeObject="configurationStore" />
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Canvas from "@/components/Canvas.vue";
import stores from "@/helpers/TaskGraphUtility";
import DecisionNode from "@/components/DecisionNode.vue";
import JSONEditor from "@/components/JSONEditor.vue";

export default {
  name: "Editor",
  components: {
    Canvas,
    DecisionNode,
    JSONEditor,
  },
  setup() {
    const configurationStore = stores.configurationStore;
    const { store, getProperty, setProperty } = configurationStore;

    const route = useRoute();
    const currentNode = computed(() => getProperty("currentNode"));
    const isDecisionNode = computed(() => {
      const edges = getProperty(`edges__${currentNode.value}`);
      if (edges) return edges.length > 1;
      return false;
    });

    return { currentNode, isDecisionNode, configurationStore };
  },
};

// "10": {
//     "zoomScale": 1,
//     "layouts": {
//         "sm": [{ "x": 12, "y": 5, "w": 2, "h": 5, "i": 2, "static": false }],
//         "md": [{ "x": 0, "y": 10, "w": 2, "h": 5, "i": 2, "static": false }],

//         "lg": [
//             { "x": 18, "y": 15, "w": 2, "h": 2, "i": 0, "static": false },
//             { "x": 20, "y": 15, "w": 2, "h": 2, "i": 1, "static": false }
//         ]
//     },
//     "components": {
//         "0": {
//             "type": "GraphTraversal",
//             "name": "Gozintograph",
//             "isValid": true,
//             "dependency": "taskData__dotDescription",
//             "component": {}
//         },
//         "1": {

//         }
//     }
// }
</script>

<style></style>
