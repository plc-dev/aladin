<template>
  <RadialMenu />
  <router-view />
</template>

<script lang="ts">
import RadialMenu from "@/components/RadialMenu.vue";

export default {
  components: { RadialMenu },
  setup() {
    return {};
  },
};
</script>

<style>
* {
  overflow: hidden;
  margin: 0;
  padding: 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

body {
  background: #e8edf1;
  box-shadow: inset 0 -7px 5px -7px rgba(0, 0, 0, 1);
  box-shadow: inset -7px -7px 5px -7px rgba(0, 0, 0, 1);
}
</style>
