<template>
  <div class="inputfield" @click="focusInput($event.target)">
    <input
      :data="key_value ? key_value : ''"
      class="inputfield__input"
      :key="key_value"
      :name="name"
      :value="value"
      :type="type"
      required
      tabindex="0"
      @keyup="$emit('update-value', $event.target)"
    />
    <label class="inputfield__label">{{ label }}</label>
  </div>
</template>

<style lang="postcss">
.inputfield {
  @apply h-12 mt-5 mb-2 border-solid border-2 border-brown_sugar rounded;
}
.inputfield__label {
  @apply inline-block bg-white_chocolate;
  transform: translate(-70px, 0);
  transition: all 0.2s ease;
}

[class*="inputfield__input"] {
  @apply inline-block bg-white_chocolate outline-none;
  text-indent: 0.5em;
  width: 75px;
  padding-top: 0.71em;
  transition: background 0.2s ease;
}

[class*="inputfield__input"]:focus ~ .inputfield__label,
[class*="inputfield__input"]:valid ~ .inputfield__label {
  transform: translate(-70px, -30px);
}
</style>

<script>
export default {
  name: "InputField",
  props: {
    label: String,
    type: String,
    value: [String, Number],
    name: String,
    key_value: String
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
