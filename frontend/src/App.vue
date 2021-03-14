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
</style>
