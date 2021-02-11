<template>
  <div class="wrapper">
    <ContourPlot :componentID="componentID" :storeObject="storeObject" />
    <DOTGraph class="foreground" :componentID="componentID" :storeObject="storeObject" />
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import ContourPlot from "@/components/taskComponents/ContourPlot.vue";
import DOTGraph from "@/components/taskComponents/DOTGraph.vue";

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

<style scoped>
.foreground {
  position: absolute;
  z-index: 2;
  top: 0;
}
</style>
