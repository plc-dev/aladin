<template>
  <div class="settings">
    <Equation />
    <p class="tex" style="text-align: center">`z = \frac{\sum_{i} \frac{v\_i}{w\_i}}{\sum_{i} \frac{1}{w\_i^{p}}}`</p>

    <button @click="execute">stuff</button>
  </div>
</template>

<script lang="ts">
import Equation from "@/components/taskComponents/math/Equation.vue";
import { mathlex } from "@/helpers/FormulaGenerator";

export default {
  name: "Settings",
  components: { Equation },
  setup() {
    const equation = {};

    const execute = () => {
      const syntaxTree = window.MathLex.parse("z = sum(v_i/w_i^p,i)/sum(1/w_i^p ,i)");
      const rendered = window.MathLex.render(syntaxTree, "latex");
      // z = sum(v_i^p,i)/sum(w_i^p ,i)
      // z = \frac{\sum_{i} \frac{v\_i}{w\_i}}{\sum_{i} \frac{1}{w\_i^{p}}}
      // z=frac(sum_(i)frac(v_i)(w_i^p))(sum_(i)frac(1)(w_i^p))
      console.dir(syntaxTree, { depth: null });
      console.log(rendered);

      document.querySelector(".tex").innerHTML = "`" + rendered + "`";
      window.MathJax.Hub.Typeset();
    };
    return { execute };
  },
};
</script>

<style scoped>
.settings {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
}
</style>
