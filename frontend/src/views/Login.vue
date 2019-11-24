<template>
  <div class="page-login">
    <div class="text-orange" v-if="error">Login fehlgeschlagen!</div>
    <form @submit.prevent="submitForm">
      Username:
      <input v-model="username" class="input mb-2" type="text" />
      Password
      <input v-model="password" class="input mb-6" type="password" />
      <button class="submit" type="submit">Anmelden</button>
    </form>
  </div>
</template>

<style lang="postcss">
.input {
  @apply block w-full px-3 py-2 border rounded text-sm outline-none;
  transition: border-color 0.15s;
}
.input:focus {
  @apply border-blue-400;
}
.submit {
  @apply inline-block px-4 py-1 bg-light-blue text-white rounded;
  transition: background-color 0.15s;
}
.submit:hover {
  @apply bg-light-blue-darker;
}
</style>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: false
    };
  },
  methods: {
    async submitForm() {
      if (Math.random > 0.5) {
        this.error = false;
        this.$router.push("/");
      } else {
        this.error = true;
      }
    }
  }
};
</script>
