<template>
  <select :class="`${elementId}__initial`" @change="emitEvent" :value="element.initial">
    <option v-for="(option, i) in element.options" :key="i">
      {{ option }}
    </option>
  </select>
</template>

<script lang="ts">
export default {
  name: "RangeFormField",
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
select {
  width: 100%;
  border-radius: 5px;
  text-align-last: center;
  text-align: center;
}
</style>
