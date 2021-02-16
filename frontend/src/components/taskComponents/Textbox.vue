<template>
  <div @click="handleClick"></div>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";

export default {
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const selected = computed(() => getProperty(`${path}__component__selected`));

    watch(selected, (newValue) => {
        if (newValue != null) setProperty({path: `${path}__isValid`, value: true});
        else setProperty({path: `${path}__isValid`, value: false});
    });
    return {};
  },
};
</script>

<style scoped>
</style>