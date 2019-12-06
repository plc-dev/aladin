<template>
  <div class="form">
    <InputField
      v-for="(input, key) in form"
      :key="key"
      :type="key"
      :label="input[key]"
      class="form__input"
      @update-value="bubbleUp"
    ></InputField>
    <Button
      class="form__button"
      :text="button"
      @click.native="$emit('submit')"
    />
  </div>
</template>

<style lang="postcss">
.form {
  @apply flex flex-col items-center justify-center;
}

.form__input {
  @apply m-6;
}

.form * {
  @apply w-full text-center rounded;
}
</style>

<script>
import InputField from "@/components/InputField";
import Button from "@/components/Button";
export default {
  name: "Form",
  components: {
    InputField,
    Button
  },
  props: {
    form: Object,
    button: String
  },
  methods: {
    bubbleUp(target) {
      this.$emit("update-value", target);
    }
  }
};
</script>
