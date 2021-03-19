<template>
  <div class="parameter_range">
    <input
      :class="`${elementId}__initial__lowerValue`"
      :type="element.type"
      :value="element.initial.lowerValue"
      :min="element.min"
      :max="element.initial.upperValue"
      @keyup="emitEvent"
    />
    <input
      :class="`${elementId}__initial__upperValue`"
      :type="element.type"
      :value="element.initial.upperValue"
      :min="element.initial.lowerValue"
      :max="element.max"
      @keyup="emitEvent"
    />
  </div>
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
input {
  margin: 5px;
  width: 50px;
  border-radius: 5px;
  box-shadow: none;
  text-align: center;
}
</style>
