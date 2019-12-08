<template>
  <div>
    <TextBox class="solution__matrix--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>{{ texts.description.body }}</template>
    </TextBox>

    <Matrix
      type="invertedMatrix"
      :matrix="invertedMatrix"
      :yLabel="true"
      :xLabel="true"
      :readonly="true"
    ></Matrix>

    <Matrix
      type="primary"
      :matrix="primary"
      :yLabel="true"
      :readonly="true"
    ></Matrix>

    <Matrix
      type="secondary"
      :matrix="secondary"
      :yLabel="true"
      @validate-field="validateField"
    ></Matrix>

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
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
import TextBox from "@/components/TextBox";
import TaskNavigation from "@/components/TaskNavigation";

import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("gozintograph");
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
    TaskNavigation
  },
  methods: {
    /**
     * Validates matrix field on the focusout-Event.
     * Returns if element-id does not match expected pattern.
     */
    validateField({ value, id }) {
      if (!/(.*)__(\d)_(\d)/.test(id)) return;
      let [, matrix, row, column] = id.match(/(.*)__(\d)_(\d)/);
      const rowObject = this[matrix][row];
      const key = Object.keys(rowObject);
      const inputField = document.querySelector(`#${id}`);
      if (value === "") {
        inputField.classList.remove("error");
        inputField.classList.remove("success");
      } else if (this[matrix][row][key][column]["amount"] == value) {
        inputField.classList.remove("error");
        inputField.classList.add("success");
        return true;
      } else {
        inputField.classList.remove("success");
        inputField.classList.add("error");
      }
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step3;
    },
    ...mapGetters({
      invertedMatrix: "getUserInvertedMatrix",
      primary: "getPrimary",
      secondary: "getUserSecondaryVector"
    })
  },
  updated() {}
};
</script>
