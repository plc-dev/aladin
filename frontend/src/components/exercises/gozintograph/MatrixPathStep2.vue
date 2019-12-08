<template>
  <div>
    <TextBox class="solution__matrix--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>{{ texts.description.body }}</template>
    </TextBox>

    <div class="matrices">
      <div class="matrices__wrapper">
        <Matrix
          type="subtractedMatrix2"
          :x-label="true"
          :y-label="true"
          :matrix="userSubtractedMatrix2"
          @validate-field="validateField"
        ></Matrix>

        <div class="inverse">
          <div
            class="inverse__add"
            v-for="(rows, index) in userSubtractedMatrix2"
            :key="index"
          >
            <div
              class="inverse__add--from"
              v-if="baseState"
              @click="showValue(index)"
            >
              +
            </div>
            <input
              type="number"
              class="inverse__add--value"
              v-if="value.includes(index)"
              v-model="amount"
            />
            <div
              class="inverse__add--to"
              v-if="row.includes(index)"
              @click="makeArrow(index)"
            >
              &cularr;
            </div>
          </div>
        </div>
      </div>

      <Matrix
        type="invertedMatrix"
        :matrix="userInvertedMatrix"
        @validate-field="validateField"
      ></Matrix>
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

.matrices__wrapper {
  @apply flex;
}

.fill {
  @apply flex justify-around w-full;
}

.inverse {
  @apply flex flex-col;
  margin-top: 28.67px;
}

.inverse__add {
  @apply flex ml-1;
}

.inverse__add--from,
.inverse__add--to {
  height: 28.67px;
}

.inverse__add--value {
  @apply flex w-8 border border-russet text-center;
  max-height: 27px;
}
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
import TextBox from "@/components/TextBox";
import TaskNavigation from "@/components/TaskNavigation";

import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("gozintograph");
export default {
  name: "MatrixPathStep2",
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
      this.noError = false;
      return false;
    },
    showValue(index) {
      this.baseState = false;
      this.value.push(index);
      this.userSubtractedMatrix2.forEach((vector, i) => {
        if (i < index) {
          this.row.push(i);
        }
      });
    },
    makeArrow(index) {
      const arrow = document.createElement("div");
      arrow.classList += index;
      arrow.innerHTML += "&lsh;";
      const parent = document.querySelector(".matrices__wrapper");
      parent.appendChild(arrow);
      this.baseState = true;
      this.value = [];
      this.row = [];
    },
    invertMatrix() {}
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step2;
    },
    ...mapGetters({
      userInvertedMatrix: "getUserInvertedMatrix",
      userSubtractedMatrix2: "getUserSubtractedMatrix2"
    })
  },
  updated() {}
};
</script>
