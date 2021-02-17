<template>
  <div @click="handleClick">
    <h1>Serveroutput</h1>
    <textarea name="Text1" cols="40" rows="5"></textarea>
  </div>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";

export default {
  name: "Textbox",
  props: {
    componentID: Number,
    storeObject: Object,
  },
  components: {
  },

  setup(props) {
    const { getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const selected = computed(() => getProperty(`${path}__component__selected`));
    const resultPath = getProperty(`${path}__result`);

    watch(selected, (newValue) => {
        if (newValue != null) setProperty({path: `${path}__isValid`, value: true});
        else setProperty({path: `${path}__isValid`, value: false});
    });
    return {};
  },
};
</script>

<style scoped>
textarea {
  resize: none;
}
</style>