<template>
  <div>
    <TextBox class="solution__matrix--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>{{ texts.description.body }}</template>
    </TextBox>

    <div class="matrices">
      <div class="matrices__subtracted">
        <p v-html="texts.matrices[0]"></p>
        <Matrix
          type="subtractedMatrixCopy"
          :xLabel="true"
          :yLabel="true"
          :readonly="true"
          :matrix="subtractedMatrixCopy"
        ></Matrix>
      </div>

      <div class="matrices__inverted">
        <p v-html="texts.matrices[1]"></p>
        <Matrix
          type="invertedMatrix"
          :matrix="userInvertedMatrix"
          @validate-field="validateField"
        >
          <template #bottom>
            <div class="matrices__fill">
              <Button
                class="matrices__fill--zero"
                :text="buttons.fillZero"
                @click.native="fillMatrix($event.target)"
              />
              <Button
                class="matrices__fill--complete"
                :text="buttons.fillComplete"
                @click.native="fillMatrix($event.target)"
              />
            </div>
          </template>
        </Matrix>
      </div>
    </div>

    <TaskNavigation
      :forward="true"
      :backward="true"
      @click-forward="validateAll"
      @click-backward="$emit('step-direction', 'backward')"
    />
  </div>
</template>

<style lang="postcss">
.solution__matrix--description {
  @apply self-center text-center m-2 pb-4;
}

.matrices {
  @apply flex flex-wrap w-full justify-around items-center mb-12;
}

.matrices__inverted,
.matrices__subtracted {
  @apply flex flex-col items-center;
}

.matrices__fill {
  @apply flex justify-center w-full cursor-pointer;
  font-size: 12px;
}

.matrices__fill * {
  text-align: center;
  padding: 2px;
  margin-left: 2.35em;
}
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
import TextBox from "@/components/TextBox";
import TaskNavigation from "@/components/TaskNavigation";
import Button from "@/components/Button";
import { invertMatrix, deepCopy } from "@/lib/helper";
import matrixMixin from "@/mixins/MatrixMixin";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("gozintograph");
export default {
  name: "MatrixPathStep2",
  data() {
    return {
      noError: true,
      row: [],
      value: [],
      baseState: true,
      amount: 1,
      subtractedMatrixCopy: [],
      invertedMatrix: []
    };
  },
  components: {
    Button,
    Matrix,
    TextBox,
    TaskNavigation
  },
  mixins: [matrixMixin],
  methods: {
    invert(user) {
      const parsedMatrix = this.userSubtractedMatrix.map(vector =>
        vector[Object.keys(vector)[0]].map(field => field.amount)
      );
      const inverted = invertMatrix(parsedMatrix);
      const matrixToInvert = user
        ? this.userInvertedMatrix
        : this.invertedMatrix;
      matrixToInvert.forEach((vector, vIndex) =>
        vector[Object.keys(vector)[0]].forEach(
          (field, fIndex) => (field.amount = inverted[vIndex][fIndex])
        )
      );
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step2;
    },
    ...mapState(["userInvertedMatrix"]),
    ...mapGetters({
      userSubtractedMatrix: "getSubtractedMatrix"
    })
  },
  mounted() {
    this.subtractedMatrixCopy = deepCopy(this.userSubtractedMatrix);
    this.invertedMatrix = deepCopy(this.userSubtractedMatrix);
    this.invert();
  }
};
</script>
