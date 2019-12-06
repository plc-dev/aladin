<template>
  <div class="solution__matrix">
    <component class="solution__matrix--body" :is="step"></component>
  </div>
</template>

<style lang="postcss">
.solution__matrix {
  @apply flex flex-col items-center;
}

.solution__matrix--body {
  @apply flex flex-wrap flex-col w-full items-center;
}
</style>

<script>
import Steps from "@/components/exercises/";
import MatrixPathStep1 from "@/components/exercises/gozintograph/MatrixPathStep1";

//@group [Gozintograph]
export default {
  name: "GozintographMatrixPath",
  components: {
    ...Steps,
    MatrixPathStep1
  },
  computed: {
    steps: function() {
      return Object.keys(Steps)
        .filter(step => /MatrixPathStep(\d)/.test(step))
        .sort((a, b) => a[a.length - 1] - b[b.length - 1]);
    },
    step: function() {
      return this.$store.state.gozintograph.matrixPathStep;
    }
  },
  mounted() {
    this.$store.commit("gozintograph/SET_MATRIX_PATH_STEP", this.steps[0]);
  }
};
</script>
