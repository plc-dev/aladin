<template>
  <div class="pathDisplay">
    <div class="path" v-for="(path, i) in [1, 2]" :key="i">
      <div>hi</div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, computed } from "vue";
import * as contour from "d3-contour";

export default {
  components: { DOTGraph },
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));

    const dependencies = getProperty(`nodes__${currentNode.value}__components__${props.componentID}__dependencies`);
    const dependency = computed(() => {
      const dependency: object = getProperty(`${dependencies["PathDisplay"]}`);
      if (!dependency) return [1,2];
      return [1,2];
    });

    onMounted(() => {
        console.warn("wass);
        console.warn(contour);
    });

    return { paths: dependency };
  },
};
</script>

<style scoped></style>
