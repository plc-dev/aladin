<template>
  <div class="matrix">
    <TextBox class="solution__matrix--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>
        <p v-html="texts.description.body"></p>
        <Button
          :text="'Lösen!'"
          :type="'submit'"
          @click.native="showSolution"
        ></Button>
      </template>
    </TextBox>

    <div class="matrices__multiplicate">
      <div class="matrices__top">
        <Matrix
          type="userInvertedMatrix"
          style="visibility: hidden"
          :matrix="userInvertedMatrix"
          :yLabel="false"
          :xLabel="false"
          :readonly="true"
        ></Matrix>

        <Matrix
          type="primary"
          :matrix="primary"
          :xLabel="true"
          :yLabel="true"
          :readonly="true"
        ></Matrix>
      </div>

      <div class="matrices__bottom">
        <div class="matrices__inverted">
          <p v-html="texts.matrices[0]"></p>
          <Matrix
            type="userInvertedMatrix"
            :matrix="userInvertedMatrix"
            :yLabel="true"
            :xLabel="true"
            :readonly="true"
          ></Matrix>
        </div>

        <Matrix
          type="secondary"
          :matrix="userSecondary"
          :yLabel="true"
          :xLabel="true"
          @validate-field="validateSecondary"
        >
        </Matrix>
      </div>
    </div>
    <TaskNavigation
      :backward="true"
      @click-backward="$emit('step-direction', 'backward')"
    />
  </div>
</template>

<style lang="postcss">
.solution__matrix--description {
  @apply self-center text-center m-2 pb-4;
}

.matrices__inverted {
  @apply flex flex-col items-center;
}

.matrices__multiplicate {
  @apply flex flex-col justify-between w-full items-center overflow-auto;
}

.matrices__top > div,
.matrices__bottom > div {
  @apply px-4;
}

@media (min-width: 1000px) {
  .matrices__multiplicate {
    max-width: 70%;
  }
}
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
import Button from "@/components/Button";
import TextBox from "@/components/TextBox";
import TaskNavigation from "@/components/TaskNavigation";
import matrixMixin from "@/mixins/MatrixMixin";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("gozintograph");
export default {
  name: "MatrixPathStep3",
  data() {
    return {
      noError: true,
      row: [],
      value: [],
      baseState: true,
      amount: 1
    };
  },
  components: {
    Matrix,
    TextBox,
    TaskNavigation,
    Button
  },
  mixins: [matrixMixin],
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step3;
    },
    ...mapState(["userInvertedMatrix"]),
    ...mapGetters({
      userSecondary: "getUserSecondaryFullVector",
      primary: "getFullPrimary",
      secondary: "getFullSecondary"
    })
  },
  updated() {}
};
</script>
