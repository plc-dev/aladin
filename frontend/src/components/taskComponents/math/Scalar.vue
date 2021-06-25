<template>
  <input class="scalar" type="number" v-model="userValue" />
</template>

<script lang="ts">
import { inject, ref, watch } from "vue";
export default {
  name: "Scalar",
  props: {
    value: Number,
  },
  setup(props) {
    const validate = () => {};
    const store = inject("store");
    const getProperty = inject("getProperty");
    const setProperty = inject("setProperty");

    const userValue = ref(null);

    watch(userValue, (newV, oldV) => {
      console.error(newV, oldV, "sup");
    });

    return { userValue };
  },
};
</script>

<style scoped>
.scalar {
  width: 30px;
  min-width: 30px;
  text-align: center;
  padding: 5px;
}
</style>
