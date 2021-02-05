<template>
  <div class="decisions">
    <div class="branch" v-for="(edge, i) in possibleEdges" :key="i">
      <Navigation :storeObject="storeObject" :nextNode="edge" />
      <DescriptionBox :storeObject="storeObject" :nodeId="edge" />
    </div>
  </div>
</template>

<script lang="ts">
import Navigation from "@/components/Navigation.vue";
import DescriptionBox from "@/components/taskComponents/DescriptionBox.vue";
import { onMounted } from "vue";

export default {
  components: { Navigation, DescriptionBox },
  props: { storeObject: Object },
  setup(props) {
    const { getProperty } = props.storeObject;
    const currentNode = getProperty("currentNode");
    const possibleEdges = getProperty(`edges__${currentNode}`);

    onMounted(() => {
      // manually set maxWidth for segmented nav elements
      const edgeCount = possibleEdges.length;
      const maxWidth = document.querySelector("body").clientWidth / edgeCount;
      Array.from(document.querySelectorAll(".traverse")).forEach((node: HTMLElement) => (node.style.maxWidth = `${maxWidth}px`));
    });

    return { possibleEdges };
  },
};
</script>

<style scoped>
.decisions {
  display: flex;
  flex-direction: row;
  justify-items: space-evenly;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.branch {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px dotted black;
  z-index: 2;
}
</style>
