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
  overflow: hidden !important;
  margin: 0;
  padding: 0;
}
</style>
