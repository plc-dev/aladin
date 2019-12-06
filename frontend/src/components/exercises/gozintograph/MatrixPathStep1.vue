<template>
  <div>
    <TextBox class="solution__matrix--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>
        {{ texts.description.body }}
      </template>
    </TextBox>
    <Matrix
      type="startMatrix"
      :x-label="true"
      :y-label="true"
      :matrix="userStartMatrix"
      v-model="userStartMatrix"
      @validate-field="validateField"
    ></Matrix>
    <Matrix
      type="unitMatrix"
      :matrix="userUnitMatrix"
      v-model="userUnitMatrix"
      @validate-field="validateField"
    ></Matrix>
  </div>
</template>

<style lang="postcss">
.solution__matrix--description {
  @apply self-center text-center m-2 pb-4;
  max-with: 96%;
}
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
import TextBox from "@/components/TextBox";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("gozintograph");
export default {
  data() {
    return {
      noError: true,
      filledMatrix: false
    };
  },

  components: {
    Matrix,
    TextBox
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
      } else {
        this.noError = false;
        inputField.classList.remove("success");
        inputField.classList.add("error");
      }
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step1;
    },
    ...mapState({
      userUnitMatrix: state => state.userUnitMatrix,
      userStartMatrix: state => state.userStartMatrix
    }),
    ...mapGetters({
      startMatrix: "getStartMatrix",
      unitMatrix: "getUnitMatrix"
    })
  },
  updated() {}
};
</script>
