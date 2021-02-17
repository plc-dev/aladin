<template>
  <div @click="handleClick">
    <p>Serveroutput:</p>
<form>
  <label for="answer">Antwort</label>
  <input type="text" id="answer" name="answer">
</form>
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
input[type=text] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 2px solid orange;
  border-radius: 4px;
}
</style>