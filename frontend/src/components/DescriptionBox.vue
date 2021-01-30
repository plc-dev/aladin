<template>
  <div class="descriptionBox">
    <h2>{{ title }}</h2>
    <img :src="image" />
    <p>{{ description }}</p>
  </div>
</template>

<script lang="ts">
import { getProperty } from "@/helpers/TaskGraphUtility";
import { onMounted } from "vue";

export default {
  props: {
    nodeId: Number,
  },
  setup(props) {
    const currentNode = getProperty("currentNode");
    const { title, image, description } = getProperty(`nodes__${currentNode}__pathDescriptions__${props.nodeId}`);

    return { image, description, title };
  },
};
</script>

<style scoped>
.descriptionBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: lightgrey;
  width: 500px;
  font-size: 150%;
}
.descriptionBox img {
}
</style>
