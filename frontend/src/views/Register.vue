<template>
  <div class="register">
    <Form
      @update-value="updateValue"
      @submit="register"
      :button="form.button"
      :form="{ email: form.email, password: form.password }"
    ></Form>
  </div>
</template>

<style lang="postcss">
.register {
  @apply flex justify-center items-center;
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
  }
};
</script>
