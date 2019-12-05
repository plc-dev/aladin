<template>
  <div class="graph__options">
    <slot name="header"></slot>
    <div v-for="option in options" :key="option.content">
      <div
        :class="`graph__options-${option.optionType}`"
        v-if="option.optionType === 'value'"
      >
        <InputField
          :value="option.value"
          :type="option.valueType"
          :label="option.label"
          :name="option.content"
          :float="option.float"
          @update-value="updateValue"
        ></InputField>
      </div>

      <div
        :class="`graph__options--${option.optionType}`"
        v-if="option.optionType === 'range'"
      >
        <InputField
          class="range__field"
          :value="option.value.min"
          :key_value="'min'"
          :name="option.content"
          :type="option.valueType"
          :label="option.label[0]"
          :float="option.float"
          @update-value="updateValue"
        ></InputField>

        <InputField
          class="range__field"
          :value="option.value.max"
          :key_value="'max'"
          :name="option.content"
          :type="option.valueType"
          :label="option.label[1]"
          :float="option.float"
          @update-value="updateValue"
        ></InputField>
      </div>
    </div>
    <slot name="buttons"></slot>
  </div>
</template>

<style lang="postcss">
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  @apply m-0;
  -webkit-appearance: none;
}

.graph__options--range {
  @apply flex flex-col;
}

.range__field {
  @apply mt-3;
}
</style>

<script>
import InputField from "@/components/InputField";
export default {
  name: "GraphOptions",
  data() {
    return {};
  },
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  components: {
    InputField
  },
  methods: {
    updateValue: function(target) {
      const value = target.value;
      const key = target.getAttribute("data") || null;
      const identifier = target.name;
      this.options.forEach((option, index) => {
        if (option.content === identifier) {
          if (key) {
            this.options[index].value[key] = parseFloat(value);
          } else {
            this.options[index].value = parseFloat(value);
          }
        }
      });
      this.$emit("input", this.options);
    }
  }
};
</script>
