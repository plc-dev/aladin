<template>
  <div class="descriptionBox">
    <h2>{{ title }}</h2>
    <img :src="image" />
    <p>{{ description }}</p>
  </div>
</template>

<script lang="ts">
import { store } from "../store/taskGraph";
import { onMounted } from "vue";

export default {
  props: {
    nodeId: Number,
  },
  setup(props) {
    const currentNode = store.getters.getPropertyFromPath("currentNode");
    const { title, image, description } = store.getters.getPropertyFromPath(`nodes__${currentNode}__pathDescriptions__${props.nodeId}`);

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
}
.descriptionBox img {
}
</style>
