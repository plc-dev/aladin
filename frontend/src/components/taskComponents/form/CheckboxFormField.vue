<template>
  <input :class="`${elementId}__initial`" @change="emitEvent" :value="element.initial" :type="element.type" :checked="element.initial" />
</template>

<script lang="ts">
export default {
  name: "CheckboxFormField",
  props: {
    element: Object,
    elementId: String,
  },
  setup(props, { emit }) {
    const emitEvent = (event) => {
      emit("updateElement", event);
    };
    return { emitEvent };
  },
};
</script>

<style scoped>
input {
  margin: 5px;
  width: 50px;
  border-radius: 5px;
  box-shadow: none;
}
</style>
