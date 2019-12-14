<template>
  <div class="matrix">
    <TextBox class="solution__matrix--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>{{ texts.description.body }}</template>
    </TextBox>

    <div class="matrices__multiplicate">
      <Matrix
        type="userInvertedMatrix"
        :matrix="userInvertedMatrix"
        :yLabel="true"
        :xLabel="true"
        :readonly="true"
      ></Matrix>

      <Matrix
        type="primary"
        :matrix="primary"
        :xLabel="true"
        :yLabel="true"
        :readonly="true"
      ></Matrix>

      <Matrix
        type="userSecondary"
        :matrix="userSecondary"
        :yLabel="true"
        :xLabel="true"
        @validate-field="validateSecondary"
      ></Matrix>
    </div>
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

.matrices__multiplicate {
  @apply flex justify-between w-full items-center overflow-auto;
}

.matrices__multiplicate > div {
  @apply px-4;
}
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
import TextBox from "@/components/TextBox";
import TaskNavigation from "@/components/TaskNavigation";

import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapState } = createNamespacedHelpers("gozintograph");
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
    validateSecondary({ value, id }) {
      let [, index] = id.match(/.*__(\d*)_\d*/);
      const key = Object.keys(this.secondary[index])[0];
      console.warn(this.secondary[index]);
      if (this.secondary[index][key][0]["amount"] == value) {
        document.querySelector(`#${id}`).classList.remove("error");
        document.querySelector(`#${id}`).classList.add("success");
      } else if (value === "") {
        document.querySelector(`#${id}`).classList.remove("success");
        document.querySelector(`#${id}`).classList.remove("error");
      } else {
        document.querySelector(`#${id}`).classList.remove("success");
        document.querySelector(`#${id}`).classList.add("error");
      }
      const correctAmount = document.querySelectorAll(".success").length;
      if (this.secondary.length === correctAmount) {
        this.onSuccess();
      }
    },
    onSuccess() {
      this.$alertify
        .confirm(
          this.success.body,
          () => {
            this.$store.commit("gozintograph/CLEAR_STATE");
            this.$destroy();
            location.reload();
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          },
          () => {
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          }
        )
        .set({ title: this.success.title })
        .set({
          labels: {
            ok: this.success.labels.ok,
            cancel: this.success.labels.cancel
          }
        });
    }
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step3;
    },
    success: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.success;
    },
    ...mapState(["userInvertedMatrix"]),
    ...mapGetters({
      userSecondary: "getUserSecondaryFullVector",
      primary: "getFullPrimary",
      secondary: "getFullSecondary"
    })
  },
  updated() {}
};
</script>
