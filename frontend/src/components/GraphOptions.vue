<template>
  <div class="graph__options">
    <div v-for="option in options" :key="option.content">
      <div
        :class="`graph__options-${option.optionType}`"
        v-if="option.optionType === 'value'"
      >
        <FloatingLabel :config="{ label: option.label, ...config }">
          <input
            :value="option.value"
            :name="option.content"
            :type="option.valueType"
            v-on:input="updateValue($event.target)"
          />
        </FloatingLabel>
      </div>

      <div
        :class="`graph__options--${option.optionType}`"
        v-if="option.optionType === 'range'"
      >
        <FloatingLabel :config="{ label: option.label[0], ...config }">
          <input
            :value="option.value.min"
            :name="option.content"
            key="min"
            :type="option.valueType"
            v-on:input="updateValue($event.target)"
          />
        </FloatingLabel>

        <FloatingLabel :config="{ label: option.label[1], ...config }">
          <input
            :value="option.value.max"
            :name="option.content"
            key="max"
            :type="option.valueType"
          />
        </FloatingLabel>
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
  @apply flex;
}
</style>

<script>
import FloatingLabel from "vue-simple-floating-labels";
import Button from "@/components/Button";
const { theme } = require("@/../tailwind.config.js");
export default {
  name: "GraphOptions",
  data() {
    return {
      config: {
        color: {
          focusColor: theme.colors.russet,
          errorColor: theme.colors.alabama_crimson,
          lineColor: theme.colors.russet,
          blurredColor: "rgba(35, 35, 35, 0.5)"
        },
        height: 70,
        hasClearButton: false
      }
    };
  },
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  components: {
    FloatingLabel,
    Button
  },
  methods: {
    updateValue: function(target) {
      const value = target.value;
      const key = target.key || null;
      const identifier = target.name;
      this.options.forEach((option, index) => {
        if (option.content === identifier) {
          if (key) {
            this.options[index].value[key] = value;
          } else {
            this.options[index].value = value;
          }
        }
      });
      this.$emit("input", this.options);
    }
  },
  mounted() {
    const inputContainers = document.querySelectorAll(".input__container");
    inputContainers.forEach(inputContainer => {
      const input = inputContainer.querySelector("input");
      if (input.value) {
        inputContainer.classList += " input__container--content";
      }

      const callback = event => {
        const input = event.target || event.srcElement;
        const target = input.parentElement.parentElement;
        if (input.value) {
          setTimeout(() => {
            target.classList += " input__container--content";
          }, 50);
        }
      };

      input.addEventListener("focus", callback);
      input.addEventListener("blur", callback);
    });
  }
};
</script>
