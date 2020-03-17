<template>
  <div class="solution__matrix">
    <transition name="slide-fade" mode="out-in">
      <component
        class="solution__matrix--body"
        @step-direction="stepDirection"
        :is="currentStep"
      ></component>
    </transition>
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
// TODO, fix import of steps - steps is undefined, probably due to cyclic dependencies, since components are imported in exercises
import Steps from "@/components/exercises/";
import MatrixPathStep0 from "@/components/exercises/gozintograph/MatrixPathStep0";
import MatrixPathStep1 from "@/components/exercises/gozintograph/MatrixPathStep1";
import MatrixPathStep2 from "@/components/exercises/gozintograph/MatrixPathStep2";
import MatrixPathStep3 from "@/components/exercises/gozintograph/MatrixPathStep3";
import MatrixPathStep4 from "@/components/exercises/gozintograph/MatrixPathStep4";
import MatrixPathStep5 from "@/components/exercises/gozintograph/MatrixPathStep5";

//@group [Gozintograph]
export default {
  name: "GozintographMatrixPath",
  components: {
    ...Steps,
    MatrixPathStep0,
    MatrixPathStep1,
    MatrixPathStep2,
    MatrixPathStep3,
    MatrixPathStep4,
    MatrixPathStep5
  },
  data() {
    return {
      currentStep: this.step
    };
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
  methods: {
    stepDirection(direction) {
      let [, step, stepIndex] = this.currentStep.match(/([a-zA-Z]{2,40})(\d)/);
      stepIndex =
        direction === "forward"
          ? parseFloat(stepIndex) + 1
          : parseFloat(stepIndex) - 1;
      if (typeof direction === "number") stepIndex = direction;
      this.currentStep = `${step}${stepIndex}`;
      this.$store.commit("gozintograph/SET_MATRIX_PATH_STEP", this.currentStep);
    }
  },
  mounted() {
    if (!this.step) {
      this.currentStep = this.steps[0];
      this.$store.commit("gozintograph/SET_MATRIX_PATH_STEP", this.steps[0]);
    } else {
      this.currentStep = this.step;
    }
  },
  activated() {
    this.currentStep = this.$store.state.gozintograph.matrixPathStep;
  }
};
</script>
