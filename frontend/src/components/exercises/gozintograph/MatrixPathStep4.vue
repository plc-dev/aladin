<template>
  <div class="matrices__selection">
    <TextBox class="matrices__selection--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>{{ texts.description.body }}</template>
    </TextBox>

    <div class="show__graph">
      Graph anzeigen:
      <img
        src="/img/icons/graph.png"
        alt="graph"
        class="show__graph--img"
        @click="showOverlay"
      />
    </div>

    <div class="matrices">
      <Matrix
        type="directMatrix"
        :x-label="true"
        :y-label="true"
        :matrix="userDirectMatrix"
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

      <Matrix
        type="unitMatrix"
        :matrix="userUnitMatrix"
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

    <TaskNavigation
      :forward="true"
      :backward="true"
      @click-forward="validateAll"
      @click-backward="$emit('step-direction', 0)"
    />

    <ScreenOverlay />
  </div>
</template>

<style lang="postcss">
.show__graph {
  @apply flex items-center;
}

.show__graph--img {
  @apply cursor-pointer;
  width: 50px;
  height: auto;
}

.solution__matrix--description {
  @apply self-center text-center m-2 pb-4;
}

.matrices {
  @apply flex flex-wrap w-full justify-around items-center mb-12;
}

.matrices__fill {
  @apply flex justify-center w-full cursor-pointer;
  font-size: 12px;
}

.matrices__fill * {
  margin-left: 2.35em;
}
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
import TextBox from "@/components/TextBox";
import ScreenOverlay from "@/components/ScreenOverlay";
import TaskNavigation from "@/components/TaskNavigation";
import Button from "@/components/Button";
import { drawGozintograph } from "@/lib/gozintograph/drawGozintograph";
import { camelCase } from "@/lib/helper";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("gozintograph");
export default {
  name: "MatrixPathStep4",
  data() {
    return {
      noError: true
    };
  },

  components: {
    Matrix,
    TextBox,
    ScreenOverlay,
    TaskNavigation,
    Button
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
    validateAll() {
      const matrices = document.querySelectorAll('[class*="matrix__"]');
      let noError = true;
      matrices.forEach(matrix =>
        Array.from(matrix.querySelectorAll("input")).forEach(field => {
          const fieldCorrect = this.validateField({
            value: field.value,
            id: field.id
          });
          if (!fieldCorrect) {
            noError = false;
          }
        })
      );
      if (noError) {
        this.noError = true;
        this.$emit("step-direction", "forward");
      } else {
        this.$alertify
          .alert("Es sind noch nicht alle Felder korrekt ausgefüllt!", () => {
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          })
          .set({ title: "Fehler!" });
      }
    },
    fillMatrix(target) {
      const onlyZero = /zero/.test(target.classList);
      const matrixType = target.parentNode.previousSibling.classList[0].substring(
        8
      );
      const filledMatrix = this[matrixType];
      const userMatrix = this[camelCase(`user ${matrixType}`)];
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
    showOverlay() {
      document.querySelector(".overlay").style.height = "100vh";
      const appendTo = document.querySelector(".overlay__content");
      const containerHeight = document.querySelector(".overlay__content")
        .offsetHeight;
      const self = this;
      setTimeout(() => {
        drawGozintograph(self.graph, appendTo, containerHeight);
      }, 50);
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step4;
    },
    buttons: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath
        .matrixButtons;
    },
    ...mapState({
      userUnitMatrix: state => state.userUnitMatrix,
      userDirectMatrix: state => state.userDirectMatrix,
      userSubtractedMatrix: state => state.userSubtractedMatrix
    }),
    ...mapGetters({
      directMatrix: "getDirectMatrix",
      unitMatrix: "getUnitMatrix",
      subtractedMatrix: "getSubtractedMatrix"
    }),
    graph: function() {
      return this.$store.state.gozintograph.graph;
    }
  },
  updated() {}
};
</script>
