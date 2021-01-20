<template>
  <table :id="`matrix_${id}`" class="matrix">
    <tr v-if="columnLabel.length">
      <p class="placeholder">&nbsp;</p>
      <th v-for="(label, i) in columnLabel" :key="i">
        <p class="matrix_label">{{ label }}</p>
      </th>
    </tr>
    <tr v-for="(row, i) in userData" :key="i">
      <th v-if="rowLabel.length">
        <p class="matrix_label">{{ rowLabel[i] }}</p>
      </th>
      <td class="matrix_element" v-for="(element, j) in userData[i]" :key="j">
        <input :class="`i__${i}__${j}`" :data-index="[i, j]" :readonly="isReadOnly" @keyup="updateField" type="number" :value="element" />
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

    const dependencyPath = store.getters.getPropertyFromPath(`nodes__${currentNode.value}__components__${props.componentID}__dependency`);
    const dependency = computed(() => store.getters.getPropertyFromPath(`${dependencyPath}`));

    const isReadOnly = store.getters.getPropertyFromPath(`${componentPath}__readOnly`);
    const instructions = store.getters.getPropertyFromPath(`${componentPath}__initialize`);

    const rowLabelPath = store.getters.getPropertyFromPath(`${componentPath}__rowLabel`);
    const columnLabelPath = store.getters.getPropertyFromPath(`${componentPath}__columnLabel`);
    const rowLabel = computed(() => store.getters.getPropertyFromPath(`${rowLabelPath}`));
    const columnLabel = computed(() => store.getters.getPropertyFromPath(`${columnLabelPath}`));

    const initialize = (instructions: IMatrixInstruction) => {
      Object.entries(instructions).forEach(([name, instructions]) => {
        const { matrix1Path, matrix2Path, operations } = instructions;
        const matrix1 = new Matrix(...store.getters.getPropertyFromPath(`${matrix1Path}`));
        const matrix2 = matrix2Path ? new Matrix(...store.getters.getPropertyFromPath(`${matrix2Path}`)) : null;
        const resultMatrix = operations.reduce((result, operation) => {
          const { name, args } = JSON.parse(JSON.stringify(operation));
          if (args.includes("matrix2")) return matrix1[name](matrix2);
          return matrix1[name](...args);
        }, matrix1);
        store.dispatch("setPropertyFromPath", { path: `${componentPath}__${name}Data`, value: resultMatrix.getRows() });
      });
    };

    onMounted(() => {
      if ((dependency.value && !userData.value) || !userData.value.length) {
        initialize(instructions);
      }
      validateMatrix();
    });

    watch(dependency, () => {
      initialize(instructions);
    });

    const loadData = (path) => {
      const data = store.getters.getPropertyFromPath(path);
      if (data) return data;
      else return [];
    };
    const userData = computed(() => loadData(`${componentPath}__userData`));
    const validationData = computed(() => loadData(`${componentPath}__validationData`));

    const updateField = (event) => {
      const element = event.target;
      const { index } = element.dataset;
      const [column, row] = index.split(",");
      let value = element.value;
      store.dispatch("setPropertyFromPath", { path: `${componentPath}__userData__${column}__${row}`, value });
    };

    const validateMatrix = () =>
      userData.value.reduce((isValid, column, i) => {
        column.forEach((value, j) => {
          const element = document.querySelector(`#matrix_${props.componentID} .i__${i}__${j}`);
          if (!element) {
            isValid = false;
            return;
          }
          if (!value) {
            element.classList.remove("valid");
            element.classList.remove("invalid");
            return;
          }
          if (validationData.value[i][j] == value) {
            element.classList.remove("invalid");
            element.classList.add("valid");
            return;
          } else {
            element.classList.remove("valid");
            element.classList.add("invalid");
            isValid = false;
          }
        });
        return isValid;
      }, true);

    watch(
      userData,
      () => {
        const isValid = validateMatrix();
        store.dispatch("setPropertyFromPath", {
          path: `nodes__${currentNode.value}__components__${props.componentID}__isValid`,
          value: isValid,
        });
      },
      { deep: true }
    );

    return { id: props.componentID, validationData, userData, rowLabel, columnLabel, isReadOnly, updateField };
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
  height: 100%;
  border-collapse: collapse;
}

.matrix .matrix_element {
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

th {
  min-height: 100%;
  border: 1px solid black;
  background: lightgrey;
}

.matrix_label {
  font-size: 150%;
  width: 100%;
  text-align: center;
}

.valid {
  background: green;
}

.invalid {
  background: red;
}
</style>
