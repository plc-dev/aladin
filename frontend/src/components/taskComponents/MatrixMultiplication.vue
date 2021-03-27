<template>
  <div>congrats, you found a hacky workaround, claim your price <button @click="alert("U+1F36A U+1F36A U+1F36A Yay, cookies! U+1F36A U+1F36A U+1F36A U+1F36A")">here</button></div>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";

export default {
  name: "Output",
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const componentPath = `${path}__component`;
    const dependencyPath = computed(() => getProperty(`${path}__dependencies`));

    const test = computed(() => {
      let serverOutput = getProperty(dependencyPath.value.Output.serverOutput);
      if (!serverOutput) serverOutput = "";
      return serverOutput;
    });
    
    return {};
  },
};
</script>

<style scoped></style>
