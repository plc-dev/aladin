<template>
  <div class="matrices__multiplication">
    <TextBox class="matrices__selection--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>{{ texts.description.body }}</template>
    </TextBox>

    <div class="matrices">
      <div class="matrices__top">
        <Matrix
          style="visibility: hidden"
          type="placeholder"
          :matrix="unitMatrix"
          :readonly="true"
        ></Matrix>
        <Matrix
          v-for="(e, index) in maxPathLength - 1"
          :key="index"
          :type="`directMatrix__${index}`"
          :x-label="true"
          :y-label="true"
          :matrix="directMatrix"
          :readonly="true"
        ></Matrix>
        <Matrix
          type="unitMatrix"
          :matrix="unitMatrix"
          :readonly="true"
        ></Matrix>
        <Matrix type="primary" :matrix="primary" :readonly="true" />
      </div>

      <div class="matrices__bottom">
        <Matrix
          type="directMatrix__0"
          :matrix="directMatrix"
          :readonly="true"
          :x-label="true"
          :y-label="true"
        ></Matrix>
        <Matrix
          v-for="(matrix, index) in emptyDirectMatrices"
          :key="index"
          :type="`userDirectMatrix__${index}`"
          :matrix="emptyDirectMatrices[index]"
          :readonly="true"
        ></Matrix>
        <Matrix
          type="aggregatedMatrix"
          :matrix="aggregatedMatrix"
          :readonly="true"
        ></Matrix>
      </div>
    </div>
    <TaskNavigation
      :forward="true"
      :backward="true"
      @click-forward="$emit('step-direction', 'forward')"
      @click-backward="$emit('step-direction', 'backward')"
    />
  </div>
</template>

<style lang="postcss">
.matrices__selection--description {
  @apply self-center text-center m-2 pb-4;
}

.matrices__multiplication .matrices {
  @apply flex flex-col px-4 mb-12 overflow-auto;
}

.matrices__top {
  @apply flex;
}

.matrices__bottom {
  @apply flex;
}
</style>

<script>
import TextBox from "@/components/TextBox";
import TaskNavigation from "@/components/TaskNavigation";
import Matrix from "@/components/exercises/gozintograph/Matrix";
import { deepCopy } from "@/lib/helper";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("gozintograph");
export default {
  name: "MatrixPathStep5",
  data() {
    return {
      aggregatedMatrix: []
    };
  },
  components: { TextBox, TaskNavigation, Matrix },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step5;
    },
    emptyDirectMatrices: function() {
      let amount = this.maxPathLength;
      let matrices = [];
      while (amount > 1) {
        matrices.push(
          deepCopy(this.$store.state.gozintograph.userSubtractedMatrix)
        );
        amount--;
      }
      return matrices;
    },
    ...mapState({
      maxPathLength: state =>
        state.graph.paths.reduce((max, path) => {
          return max > path.length ? max : path.length;
        }, 0)
    }),
    ...mapGetters({
      directMatrix: "getDirectMatrix",
      unitMatrix: "getUnitMatrix",
      primary: "getFullPrimary"
    })
  },
  mounted() {
    this.aggregatedMatrix = deepCopy(
      this.$store.state.gozintograph.userSubtractedMatrix
    );
  }
};
</script>
