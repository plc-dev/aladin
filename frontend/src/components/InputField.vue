<template>
  <FloatLabel>
    <input
      :data="key_value ? key_value : ''"
      class="inputfield__input"
      :key="key_value"
      :step="float"
      :name="name"
      :value="value"
      :type="type"
      required
      :placeholder="label"
      tabindex="0"
      @keyup="$emit('update-value', $event.target)"
    />
  </FloatLabel>
</template>

<style lang="postcss">
[class*="inputfield__input"] {
  @apply bg-background border border-solid border-main rounded text-center text-sm;
  width: 80%;
  transition: background 0.2s ease;
}

[class*="inputfield__input"]:focus {
  @apply border-contrast;
}

.vfl-label-on-focus {
  @apply text-contrast;
}
</style>

<script>
import FloatLabel from "vue-float-label/components/FloatLabel";
export default {
  name: "InputField",
  components: { FloatLabel },
  props: {
    label: String,
    type: String,
    value: [String, Number],
    name: String,
    key_value: String,
    float: String
  },
  methods: {
    /**
     * Sets focus to input field, if adjacent or parent element was clicked
     * @args clicked element
     */
    focusInput(target) {
      let input = target.querySelector("input");
      if (/(__label|__input)/.test(target.classList)) {
        input = target.parentNode.querySelector("input");
      }
      input.focus();
    }
  }
};
</script>
