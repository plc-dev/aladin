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
        <Matrix
          v-for="(e, index) in maxPathLength - 1"
          :key="index"
          :type="`directMatrix__${index}`"
          :x-label="!index ? true : false"
          :y-label="!index ? true : false"
          :matrix="directMatrix"
          :readonly="true"
        />
        <Matrix type="unitMatrix" :matrix="unitMatrix" :readonly="true" />
        <Matrix
          type="primary"
          :matrix="primary"
          :readonly="true"
          :y-label="true"
        />
      </div>

      <div class="matrices__bottom">
        <Matrix
          type="directMatrix__0"
          :matrix="directMatrix"
          :readonly="true"
          :x-label="true"
          :y-label="true"
        />
        <Matrix
          v-for="(matrix, index) in userDirectMatrices"
          :key="index"
          :type="`directMatrices__${index}`"
          :matrix="userDirectMatrices[index]"
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
        <Matrix type="aggregatedMatrix" :matrix="userAggregatedMatrix">
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
import Button from "@/components/Button";
import {
  retrieveMatrix,
  matrixMultiplication,
  deepCopy,
  camelCase
} from "@/lib/helper";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("gozintograph");
export default {
  name: "MatrixPathStep5",
  components: { TextBox, TaskNavigation, Matrix, Button },
  methods: {
    fillMatrix(target, array) {
      const onlyZero = /zero/.test(target.classList);
      let filledMatrix, userMatrix;
      let matrixType = target.parentNode.previousSibling.classList[0].substring(
        8
      );
      if (array) {
        let index;
        [, matrixType, index] = matrixType.match(/(\w*)__(\d*)/);
        filledMatrix = this[matrixType][index];
        userMatrix = this[camelCase(`user ${matrixType}`)][index];
      } else {
        filledMatrix = this[matrixType];
        userMatrix = this[camelCase(`user ${matrixType}`)];
      }
      for (let i = 0; i < filledMatrix.length; i++) {
        const filledVector = filledMatrix[i];
        const userVector = userMatrix[i];
        const vectorKey = Object.keys(filledVector)[0];
        for (let j = 0; j < filledMatrix.length; j++) {
          if (
            !onlyZero ||
            (onlyZero && filledVector[vectorKey][j].amount === 0)
          ) {
            userVector[vectorKey][j].amount = filledVector[vectorKey][j].amount;
          }
        }
      }
    },
    validateSecondary({ value, id }) {
      let [, index] = id.match(/.*__\d*_(\d*)/);
      if (this.secondary[0]["S"][index]["amount"] == value) {
        document.querySelector(`#${id}`).classList.remove("error");
        document.querySelector(`#${id}`).classList.add("success");
      } else if (value === "") {
        document.querySelector(`#${id}`).classList.remove("success");
        document.querySelector(`#${id}`).classList.remove("error");
      } else {
        document.querySelector(`#${id}`).classList.remove("success");
        document.querySelector(`#${id}`).classList.add("error");
      }
      const correctAmount = document.querySelectorAll(".success").length;
      if (this.secondary[0]["S"].length === correctAmount) {
        this.onSuccess();
      }
    },
    onSuccess() {
      this.$alertify
        .confirm(
          this.success.body,
          () => {
            this.$store.commit("gozintograph/CLEAR_STATE");
            this.$destroy();
            location.reload();
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          },
          () => {
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          }
        )
        .set({ title: this.success.title })
        .set({
          labels: {
            ok: this.success.labels.ok,
            cancel: this.success.labels.cancel
          }
        });
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step5;
    },
    success: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.success;
    },
    buttons: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath
        .matrixButtons;
    },
    dummyMatrix: function() {
      const graph = this.$store.state.gozintograph.graph;
      const connections = graph.connections;
      const nodes = graph.level.flatMap(level => level.map(node => node));
      return retrieveMatrix(connections, nodes, 0);
    },
    userAggregatedMatrix: function() {
      const graph = this.$store.state.gozintograph.graph;
      const connections = graph.connections;
      const nodes = graph.level.flatMap(level => level.map(node => node));
      return retrieveMatrix(connections, nodes, 0, true);
    },
    userDirectMatrices: function() {
      let amount = this.maxPathLength;
      let matrices = [];
      const graph = this.$store.state.gozintograph.graph;
      const connections = graph.connections;
      const nodes = graph.level.flatMap(level => level.map(node => node));
      while (amount > 1) {
        matrices.push(retrieveMatrix(connections, nodes, 0, true));
        amount--;
      }
      return matrices;
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
    ...mapState({
      maxPathLength: state =>
        state.graph.paths.reduce((max, path) => {
          return max > path.length ? max : path.length;
        }, 0)
    }),
    ...mapGetters({
      directMatrix: "getDirectMatrix",
      unitMatrix: "getUnitMatrix",
      primary: "getFullPrimary",
      userSecondary: "getUserSecondaryFullVector",
      secondary: "getFullSecondary"
    })
  }
};
</script>
