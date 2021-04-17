<template>
  <input class="scalar" type="number" :value="value" />
</template>

<script lang="ts">
export default {
  name: "Scalar",
  props: {
    value: Number,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.scalar {
  width: 30px;
  text-align: center;
  padding: 5px;
}
</style>
