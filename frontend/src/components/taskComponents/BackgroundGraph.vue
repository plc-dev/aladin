<template>
  <div class="background"></div>
</template>

<script>
import { onMounted, computed } from "vue";
import ContourPlot from "ContourPlot.vue";
import DOTGraph from "DOTGraph.vue";

export default {
  props: {
    componentID: Number,
    storeObject: Object,
  },
  components: {
    DOTGraph,
    ContourPlot,
  },
  setup(props) {
    const { getProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));

    const dependencyPath = getProperty(`nodes__${currentNode.value}__components__${props.componentID}__dependencies`);
    const data = computed(() => {
      return;
    });

    return {};
  },
};
</script>

<style scoped></style>
