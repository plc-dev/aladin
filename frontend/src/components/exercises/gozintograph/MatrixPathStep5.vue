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
        />
        <div
          class="matrices__top--direct"
          v-for="(e, index) in maxPathLength - 1"
          :key="index"
        >
          <p v-html="texts.matrices[0]"></p>
          <Matrix
            :type="`directMatrix__${index}`"
            :x-label="!index ? true : false"
            :y-label="!index ? true : false"
            :matrix="directMatrix"
            :readonly="true"
          />
        </div>
        <div class="matrices__top--unit">
          <p v-html="texts.matrices[1]"></p>
          <Matrix type="unitMatrix" :matrix="unitMatrix" :readonly="true" />
        </div>
        <Matrix
          type="primary"
          :matrix="primary"
          :readonly="true"
          :y-label="true"
        />
      </div>

      <div class="matrices__bottom">
        <div class="matrices__bottom--direct">
          <p v-html="texts.matrices[0]"></p>
          <Matrix
            type="directMatrix__0"
            :matrix="directMatrix"
            :readonly="true"
            :x-label="true"
            :y-label="true"
          />
        </div>
        <div
          class="matrices__bottom--direct"
          v-for="(matrix, index) in userDirectMatrices"
          :key="index"
        >
          <p
            v-html="templateString(texts.matrices[3], { index: index + 2 })"
          ></p>
          <Matrix
            :type="`directMatrices__${index}`"
            :matrix="userDirectMatrices[index]"
            @validate-field="validateField"
          >
            <template #bottom>
              <div class="matrices__fill">
                <Button
                  class="matrices__fill--zero"
                  :text="buttons.fillZero"
                  @click.native="fillMatrix($event.target, true)"
                />
                <Button
                  class="matrices__fill--complete"
                  :text="buttons.fillComplete"
                  @click.native="fillMatrix($event.target, true)"
                />
              </div>
            </template>
          </Matrix>
        </div>
        <div class="matrices__bottom--aggregated">
          <p v-html="texts.matrices[2]"></p>
          <Matrix
            type="aggregatedMatrix"
            :matrix="userAggregatedMatrix"
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
        <Matrix
          type="secondary"
          :matrix="userSecondary"
          :y-label="true"
          @validate-field="validateSecondary"
        />
      </div>
    </div>
    <TaskNavigation
      :backward="true"
      @click-backward="$emit('step-direction', 'backward')"
    />
  </div>
</template>

<style lang="postcss">
.matrices__selection--description {
  @apply self-center text-center m-2 pb-4;
}

.matrices__multiplication .matrices {
  @apply flex flex-col mb-12 overflow-x-auto overflow-y-hidden;
}

.matrices__multiplication .matrices > div {
  @apply px-4;
}

.matrices__top {
  @apply flex items-end;
}

.matrices__bottom {
  @apply flex;
}

.matrices__bottom .matrix__secondary {
  padding-top: 27px;
}

.matrices__bottom--direct,
.matrices__bottom--aggregated,
.matrices__top--direct,
.matrices__top--unit {
  @apply flex flex-col items-center;
}
</style>

<script>
import TextBox from "@/components/TextBox";
import TaskNavigation from "@/components/TaskNavigation";
import Matrix from "@/components/exercises/gozintograph/Matrix";
import Button from "@/components/Button";
import matrixMixin from "@/mixins/MatrixMixin";
import {
  retrieveMatrix,
  matrixMultiplication,
  deepCopy,
  templateString
} from "@/lib/helper";

import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("gozintograph");
export default {
  name: "MatrixPathStep5",
  components: { TextBox, TaskNavigation, Matrix, Button },
  mixins: [matrixMixin],
  data() {
    return { templateString };
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step5;
    },
    dummyMatrix: function() {
      const graph = this.$store.state.gozintograph.graph;
      const connections = graph.connections;
      const nodes = graph.level.flatMap(level => level.map(node => node));
      return retrieveMatrix(connections, nodes, 0);
    },
    directMatrices: function() {
      const d1 = this.directMatrix.map(vector =>
        vector[Object.keys(vector)[0]].map(field => field.amount)
      );
      const filledDirectMatrices = [];

      this.userDirectMatrices.forEach((matrix, index) => {
        let multiplied = [];
        if (!index) multiplied = matrixMultiplication(d1, d1);
        else {
          const dN = filledDirectMatrices[index - 1].map(vector =>
            vector[Object.keys(vector)[0]].map(field => field.amount)
          );
          multiplied = matrixMultiplication(dN, d1);
        }
        filledDirectMatrices.push(deepCopy(matrix));
        filledDirectMatrices[index].forEach((vector, vIndex) =>
          vector[Object.keys(vector)[0]].forEach(
            (field, fIndex) => (field.amount = multiplied[vIndex][fIndex])
          )
        );
      });
      return filledDirectMatrices;
    },
    aggregatedMatrix: function() {
      return [
        ...this.directMatrices,
        this.unitMatrix,
        this.directMatrix
      ].reduce((aggregated, matrix) => {
        for (let vIndex = 0; vIndex < matrix.length; vIndex++) {
          const aggVector = aggregated[vIndex];
          const mVector = matrix[vIndex];
          const key = Object.keys(mVector)[0];
          for (let fIndex = 0; fIndex < aggVector[key].length; fIndex++) {
            aggVector[key][fIndex].amount += mVector[key][fIndex].amount;
          }
        }
        return aggregated;
      }, this.dummyMatrix);
    },
    ...mapGetters({
      directMatrix: "getDirectMatrix",
      unitMatrix: "getUnitMatrix",
      primary: "getFullPrimary",
      userSecondary: "getUserSecondaryFullVector",
      secondary: "getFullSecondary",
      userDirectMatrices: "getUserDirectMatrices",
      maxPathLength: "getMaxPathLength",
      userAggregatedMatrix: "getUserAggregatedMatrix"
    })
  }
};
</script>
