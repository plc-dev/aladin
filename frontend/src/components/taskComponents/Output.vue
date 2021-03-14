<template>
  <div class="output__component">
    <h2>{{ header }}</h2>
    <div class="output">{{ serverOutput }}</div>
  </div>
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

    const serverOutput = computed(() => {
      const dependency = getProperty(dependencyPath.value.Output.serverOutput);
      if (!dependency) return "";
      return dependency;
    });

    const validOutput = computed(() => getProperty(dependencyPath.value.Output.validOutput));

    const header = computed(() => getProperty(`${componentPath}__header`));

    watch(validOutput, (isValid) => {
      setProperty({ path: `${path}__isValid`, value: isValid });
    });
    return { serverOutput, header };
  },
};
</script>

<style scoped>
.output__component {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
