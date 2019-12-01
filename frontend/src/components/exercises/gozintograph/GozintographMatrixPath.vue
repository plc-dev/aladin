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

//@group [Gozintograph]
export default {
  name: "GozintographMatrixPath",
  components: {
    ...Steps
  },
  computed: {
    steps: function() {
      console.warn(Steps);
      return Object.keys(Steps).map(step => step.match(/MatrixPathStep(\d)/).sort((a,b) => a[a.length-1] - b[b.length-1]));
    }, 
    step: function() {
      return this.$store.state.gozintograph.matrixPathStep;
    }
  },
  mounted() {
    this.$store.dispatch("gozintograph/setUserStartMatrix");
    this.$store.dispatch("gozintograph/setUserUnitMatrix");

    this.$store.commit('gozintograph/SET_MATRIX_PATH_STEP', this.steps);
  }
};
</script>
