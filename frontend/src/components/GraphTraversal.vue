<template>
  <div>
    <DOTGraph :componentID="componentID" />
  </div>
</template>

<script lang="ts">
import { onMounted, toRefs, ref, watch } from "vue";
import DOTGraph from "@/components/DOTGraph";

export default {
  components: { DOTGraph },
  props: {
    componentID: Number,
  },
  setup() {
    return { componentID: props.componentID };
  },
};
</script>

<style scoped></style>
