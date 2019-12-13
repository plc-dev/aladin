<template>
  <div>
    <TextBox class="solution__matrix--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>{{ texts.description.body }}</template>
    </TextBox>

    <div class="matrices">
      <Matrix
        type="subtractedMatrixCopy"
        :x-label="true"
        :y-label="true"
        :readonly="true"
        :matrix="subtractedMatrixCopy"
        @validate-field="validateField"
      ></Matrix>

      <Matrix
        type="invertedMatrix"
        :matrix="userInvertedMatrix"
        @validate-field="validateField"
      >
        <template #bottom>
          <div class="matrices__complete">
            <Button :text="texts.button" @click.native="invert" />
          </div>
        </template>
      </Matrix>
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
.solution__matrix--description {
  @apply self-center text-center m-2 pb-4;
}

.matrices {
  @apply flex flex-wrap w-full justify-around items-center mb-12;
}

.matrices__complete {
  @apply flex justify-end w-full;
}

.matrices__complete * {
  font-size: 12px;
  max-width: calc(50% - 2.35em);
}
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
import TextBox from "@/components/TextBox";
import TaskNavigation from "@/components/TaskNavigation";
import Button from "@/components/Button";
import { invertMatrix, deepCopy } from "@/lib/helper";

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
      subtractedMatrixCopy: []
    };
  },

  components: {
    Button,
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
      if (!/(.*)__(\d*)_(\d*)/.test(id)) return;
      let [, matrix, row, column] = id.match(/(.*)__(\d*)_(\d*)/);
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
      this.noError = false;
      return false;
    },
    invert() {
      const parsedMatrix = this.userSubtractedMatrix.map(vector =>
        vector[Object.keys(vector)[0]].map(field => field.amount)
      );
      const inverted = invertMatrix(parsedMatrix);
      this.userInvertedMatrix.forEach((vector, vIndex) =>
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
  }
};
</script>
