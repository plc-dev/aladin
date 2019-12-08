<template>
  <div class="register">
    <Form
      @update-value="updateValue"
      @submit="register"
      :button="form.button"
      :form="{ email: form.email, password: form.password }"
      :class="{ form__error: error }"
    ></Form>
  </div>
</template>

<style lang="postcss">
.register {
  @apply flex justify-center items-center;
}

.form__error * {
  @apply border-alabama_crimson text-alabama_crimson;
}
</style>

<script>
import Form from "@/components/Form";
export default {
  name: "Register",
  components: {
    Form
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    form: function() {
      const texts = this.$store.state.user.texts;
      return texts.register;
    },
    error: function() {
      return this.$store.state.user.registerError;
    }
  },
  methods: {
    updateValue(target) {
      this[target.type] = target.value;
    },
    register() {
      this.$store.dispatch("user/register", {
        email: this.email,
        password: this.password
      });
    }
  },
  mounted() {
    this.$store.state.user.registerError = false;
  }
};
</script>
