<template>
  <ContextMenu :componentId="id" :methods="selectedMethods" :storeObject="storeObject">
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
  </ContextMenu>
</template>

<script lang="ts">
import { onMounted, computed, watch, ComputedRef } from "vue";
import { Matrix } from "@/helpers/LinearAlgebra";
import { IMatrixInstruction } from "@/interfaces/MatrixInterface";
import ContextMenu from "@/components/taskComponents/ContextMenu.vue";

export default {
  props: { componentID: Number, storeObject: Object },
  components: {
    ContextMenu,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => store.state.currentNode);
    const componentPath = `nodes__${currentNode.value}__components__${props.componentID}__component`;

    const dependencies = getProperty(`nodes__${currentNode.value}__components__${props.componentID}__dependencies`);
    const dependency = computed(() => getProperty(dependencies.Matrix.data));

    const isReadOnly = getProperty(`${componentPath}__readOnly`);
    const instructions = getProperty(`${componentPath}__initialize`);
    const rowLabelPath = getProperty(`${componentPath}__rowLabel`);
    const columnLabelPath = getProperty(`${componentPath}__columnLabel`);
    const rowLabel = computed(() => {
      if (rowLabelPath) return getProperty(rowLabelPath);
      else return [];
    });
    const columnLabel = computed(() => {
      if (rowLabelPath) return getProperty(columnLabelPath);
      else return [];
    });

    const initialize = (instructions: IMatrixInstruction) => {
      Object.entries(instructions).forEach(([name, instructions]) => {
        const strip = (v) => JSON.parse(JSON.stringify(v));
        const { matrix1Path, matrix2Path, operations } = instructions;
        const matrix1 = new Matrix(...strip(getProperty(`${matrix1Path}`)));
        const matrix2 = matrix2Path ? new Matrix(...strip(getProperty(`${matrix2Path}`))) : null;
        const resultMatrix = operations.reduce((result, operation) => {
          const { name, args } = JSON.parse(JSON.stringify(operation));
          if (args.includes("matrix2")) return matrix1[name](matrix2);
          return matrix1[name](...args);
        }, matrix1);
        setProperty({ path: `${componentPath}__${name}Data`, value: resultMatrix.getRows() });
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
      const data = getProperty(path);
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
      setProperty({ path: `${componentPath}__userData__${column}__${row}`, value });
    };

    const validateMatrix = () => {
      if (isReadOnly) return true;
      return userData.value.reduce((isValid, column, i) => {
        column.forEach((value, j) => {
          const element = document.querySelector(`#matrix_${props.componentID} .i__${i}__${j}`);
          if (!element) {
            isValid = false;
            return;
          }
          if (!value) {
            element.classList.remove("valid");
            element.classList.remove("invalid");
            return false;
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
    };
    watch(
      userData,
      () => {
        const isValid = validateMatrix();
        setProperty({
          path: `nodes__${currentNode.value}__components__${props.componentID}__isValid`,
          value: isValid,
        });
      },
      { deep: true }
    );

    const methods = {
      fillZeros: () => {
        const solution = JSON.parse(JSON.stringify(getProperty(`${componentPath}__validationData`)));
        const userData = JSON.parse(JSON.stringify(getProperty(`${componentPath}__userData`)));
        const merged = solution.map((row, i) =>
          row.map((value, j) => {
            if (value === 0) return "0";
            return userData[i][j];
          })
        );
        setProperty({ path: `${componentPath}__userData`, value: merged });
      },
      showSolution: () => {
        const solution = JSON.parse(JSON.stringify(getProperty(`${componentPath}__validationData`)));
        setProperty({ path: `${componentPath}__userData`, value: solution });
      },
      copyToClipboard: () => {},
    };
    const selectedMethods = () =>
      Object.entries(getProperty(`nodes__${currentNode.value}__components__${props.componentID}__methods`)).reduce(
        (selectedMethods, [name, description]: [string, string]) => ({ ...selectedMethods, [description]: methods[name] }),
        {}
      );

    return {
      id: props.componentID,
      validationData,
      userData,
      rowLabel,
      columnLabel,
      isReadOnly,
      updateField,
      selectedMethods: selectedMethods(),
    };
  },
};
</script>

<style scoped>
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
