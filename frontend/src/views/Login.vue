<template>
  <div class="login">
    <Form
      @update-value="updateValue"
      @submit="login"
      :button="form.button"
      :form="{ email: form.email, password: form.password }"
    ></Form>
  </div>
</template>

<style lang="postcss">
.login {
  @apply flex justify-center items-center;
}
</style>

<script>
import Form from "@/components/Form";
export default {
  name: "Login",
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
      return texts.login;
    }
  },
  methods: {
    updateValue(target) {
      this[target.type] = target.value;
    },
    login() {
      this.$store.dispatch("user/login", {
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>
