<template>
  <div class="parameter_range">
    <input
      :class="`${elementId}__initial__lowerValue`"
      :type="element.type"
      :value="element.initial.lowerValue"
      :min="element.boundaries.min"
      :max="element.boundaries.max"
      :step="element.step"
      oninput="this.reportValidity()"
      @keyup="emitEvent"
    />
    <input
      :class="`${elementId}__initial__upperValue`"
      :type="element.type"
      :value="element.initial.upperValue"
      :min="element.boundaries.min"
      :max="element.boundaries.max"
      :step="element.step"
      oninput="this.reportValidity()"
      @keyup="emitEvent"
    />
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed } from "vue";
import { delay } from "@/helpers/HelperFunctions.ts";
import { evaluateRange } from "./validation";

export default {
  name: "RangeFormField",
  props: {
    element: Object,
    elementId: String,
  },
  setup(props, { emit }) {
    const emitEvent = (event) => {
      delay(
        "formFill",
        () => {
          evaluateRange(props);
          emit("updateElement", event);
        },
        500
      );
    };

    onMounted(() => {
      evaluateRange(props);
    });

    return { emitEvent };
  },
};
</script>

<style scoped>
input {
  margin: 5px;
  width: 50px;
  border-radius: 5px;
  text-align: center;
  border: 3px solid black;
}

input:focus {
  outline: none;
}

input.invalid {
  border: 3px solid red;
}

input.valid {
  border: 3px solid green;
}
</style>
