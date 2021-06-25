<template>
  <div class="equation">
    <Term :terms="leftTerm" />
    <div class="operator">{{ comparisonOperator }}</div>
    <Term :terms="rightTerm" />
  </div>
</template>

<script lang="ts">
import Term from "@/components/taskComponents/math/Term.vue";
import { formulaGenerator } from "@/helpers/FormulaGenerator";
import { computed, onMounted, provide } from "vue";

export default {
  name: "Equation",
  components: {
    Term,
  },
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    provide("store", store);
    provide("getProperty", getProperty);
    provide("setProperty", setProperty);

    const currentNode = computed(() => store.state.currentNode);
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const dependencies = getProperty(`${path}__dependencies`);
    const variableTable = computed(() => {
      const variables = dependencies.Equation.variables;
      const variableTable = Object.entries(variables).reduce((variableTable, [variableName, variablePath]) => {
        variableTable[variableName] = getProperty(variablePath);
        return variableTable;
      }, {});
      return variableTable;
    });

    const formula = computed(() => getProperty(`${path}__component__formula`) || "");
    const texFormula = computed(() => getProperty(`${path}__component__texFormula`) || "");
    const { aladin, latex, sage } = formulaGenerator(formula.value, variableTable.value, texFormula.value);
    const { leftTerm, rightTerm, comparisonOperator } = aladin;

    setProperty({ path: `${path}__component__tex`, value: latex });

    return { leftTerm, rightTerm, comparisonOperator };
  },
};
</script>

<style scoped>
.equation {
  display: flex;
  overflow-x: scroll;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.equation > * {
  margin: 0 10px;
}

.operator {
  font-size: 20px;
  width: 20px;
}
</style>
