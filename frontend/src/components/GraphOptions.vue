<template>
  <div class="graph__options">
    <div v-for="option in options" :key="option.content">
      <div :class="`graph__options-${option.optionType}`" v-if="option.optionType === 'value'">
        <InputField
          :value="option.value"
          :type="option.valueType"
          :label="option.label"
          :name="option.content"
          @update-value="updateValue"
        ></InputField>
      </div>

      <div :class="`graph__options--${option.optionType}`" v-if="option.optionType === 'range'">
        <InputField
          :value="option.value.min"
          :key_value="'min'"
          :name="option.content"
          :type="option.valueType"
          :label="option.label[0]"
          @update-value="updateValue"
        ></InputField>

        <InputField
          :value="option.value.max"
          :key_value="'max'"
          :name="option.content"
          :type="option.valueType"
          :label="option.label[1]"
          @update-value="updateValue"
        ></InputField>
      </div>
    </div>
    <Button :text="'Submit'" :type="'submit'"></Button>
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
</style>

<script>
import InputField from "@/components/InputField";
import Button from "@/components/Button";
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
    InputField,
    Button
  },
  methods: {
    updateValue: function(target) {
      const value = target.value;
      const key = target.getAttribute("data") || null;
      const identifier = target.name;
      console.warn(key, value);
      this.options.forEach((option, index) => {
        if (option.content === identifier) {
          if (key) {
            this.options[index].value[key] = parseInt(value, 10);
          } else {
            this.options[index].value = parseInt(value, 10);
          }
        }
      });
      this.$emit("input", this.options);
    }
  }
};
</script>
