<template>
  <div class="solution__matrix">
    <component class="solution__matrix--body" :is="step"></component>
  </div>
</template>

<style lang="postcss">
.solution__matrix {
  @apply flex flex-col items-center mt-6;
}

.solution__matrix--description {
  max-width: 40vw;
}

.solution__matrix--body {
  @apply flex flex-wrap;
  max-width: 45vw;
}

.solution__matrix--body > div {
  @apply p-5;
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
