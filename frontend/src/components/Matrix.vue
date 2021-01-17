<template>
  <table :id="`matrix_${id}`" class="matrix">
    <tr v-for="(row, i) in adjacencyMatrix" :key="i">
      <td v-for="(element, j) in adjacencyMatrix[i]" :key="j">
        <input type="number" :value="element" />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { onMounted, computed, watch, ComputedRef } from "vue";
import { Matrix } from "../helpers/LinearAlgebra";
import { store } from "../store/taskGraph";
import { IMatrixInstruction } from "@/interfaces/MatrixInterface";

export default {
  props: { componentID: Number },
  setup(props: { componentID: number }) {
    const currentNode = computed(() => store.state.currentNode);
    const componentPath = `nodes__${currentNode.value}__components__${props.componentID}__component`;

    const instructions = computed((): IMatrixInstruction => store.getters.getPropertyFromPath(`${componentPath}__initialize`));

    const dependency = computed(() => store.getters.getPropertyFromPath(`${instructions.value.matrix1Path}`));

    watch(dependency, () => {
      initialize(instructions);
    });

    const initialize = (instruction: ComputedRef<IMatrixInstruction>) => {
      const { operation, matrix1Path, matrix2Path } = instruction.value;
      const matrix1 = new Matrix(...store.getters.getPropertyFromPath(`${componentPath}__${matrix1Path}`));
      const matrix2 = matrix2Path ? new Matrix(...store.getters.getPropertyFromPath(`${componentPath}__${matrix2Path}`)) : null;
      const validationMatrix = matrix2 ? matrix1[operation](matrix2) : matrix1[operation]();

      store.dispatch("setPropertyFromPath", { path: `${componentPath}__initialData`, value: initialData.value });
      store.dispatch("setPropertyFromPath", { path: `${componentPath}__validationData`, value: validationMatrix.value });
    };

    const adjacencyMatrix = computed(() => {
      const adjacencyMatrix = store.getters.getPropertyFromPath("taskData").adjacencyMatrix;
      if (adjacencyMatrix) return new Matrix(...adjacencyMatrix).getRows();
      else return [[null], [null]];
    });

    const initialData = computed(() => store.getters.getPropertyFromPath(`${componentPath}__initialData`).getRows());
    const validationData = computed(() => store.getters.getPropertyFromPath(`${componentPath}__validationData`).getRows());

    return { adjacencyMatrix, id: props.componentID, validationData, initialData };
  },
};
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.matrix {
  width: 100%;
  min-height: 100%;
}

.matrix td {
  min-height: 100%;
  position: relative;
  border: 2px solid black;
}

.matrix input {
  top: 0px;
  position: absolute;
  width: 100%;
  min-height: 100%;
  font-size: 150%;
  text-align: center;
}
</style>
