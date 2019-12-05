<template>
  <div class="path">
    <TextBox class="path__description">
      <template #header>{{ texts.task.description.header }}</template>
      <template #body>
        {{ texts.task.description.body }}
      </template>
    </TextBox>

    <div class="show__path--fullscreen" @click="showOverlay">
      <div class="primary" v-if="primary">
        <!-- <div>{{ texts.labels.primary }}</div> -->
        &imof;
      </div>
      <Matrix
        :show="true"
        :matrix="primary"
        :yLabel="true"
        type="primary"
      ></Matrix>
    </div>

    <div class="secondary">
      <!-- <div>{{ texts.labels.secondary }}</div> -->
      <Matrix
        :matrix="userSecondary"
        v-model="userSecondary"
        :yLabel="true"
        type="secondary"
        @validate-field="validateSecondary"
      ></Matrix>
    </div>

    <PathBuilder />

    <ScreenOverlay />
  </div>
</template>

<style lang="postcss">
.path {
  @apply flex flex-col items-center;
}

.path__description {
  @apply self-center text-center m-2 pb-4;
}

.primary,
.secondary {
  @apply flex flex-wrap items-center justify-around;
}
</style>

<script>
import PathBuilder from "@/components/exercises/gozintograph/PathBuilder";
import TextBox from "@/components/TextBox";
import Matrix from "@/components/exercises/gozintograph/Matrix";
import ScreenOverlay from "@/components/ScreenOverlay";
import { drawGozintograph } from "@/lib/gozintograph/drawGozintograph";
import alertify from "alertify.js";
export default {
  components: {
    PathBuilder,
    TextBox,
    Matrix,
    ScreenOverlay
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return {
        task:
          texts.exercises.gozintograph.tabs.GozintographMultiplicationPath
            .step1,
        labels: {
          primary:
            texts.exercises.gozintograph.tabs.GozintographScope.description
              .primary,
          secondary:
            texts.exercises.gozintograph.tabs.GozintographScope.description
              .secondary
        }
      };
    },
    primary: function() {
      return this.$store.getters["gozintograph/getPrimary"];
    },
    userSecondary: function() {
      return this.$store.getters["gozintograph/getUserSecondaryVector"];
    },
    secondary: function() {
      return this.$store.getters["gozintograph/getSecondaryVector"];
    },
    graph: function() {
      return this.$store.state.gozintograph.graph;
    }
  },
  methods: {
    validateSecondary({ value, id }) {
      const index = id.slice(-1);
      if (this.secondary[index].amount == value) {
        document.querySelector(`#${id}`).classList.remove("error");
        document.querySelector(`#${id}`).classList.add("success");
      } else if (value === "") {
        document.querySelector(`#${id}`).classList.remove("success");
        document.querySelector(`#${id}`).classList.remove("error");
      } else {
        document.querySelector(`#${id}`).classList.remove("success");
        document.querySelector(`#${id}`).classList.add("error");
      }
      //TODO setup proper success handling
      const correctAmount = document.querySelectorAll(".success").length;
      if (this.secondary.length === correctAmount) {
        alertify
          .confirm()
          .setting({
            onok: () => console.warn(this.$router)
          })
          .show();
      }
    },
    /**
     * shows Graph as screen overlay
     */
    showOverlay() {
      document.querySelector(".overlay").style.height = "100vh";
      const appendTo = document.querySelector(".overlay__content");
      const containerHeight = document.querySelector(".overlay__content")
        .offsetHeight;
      const self = this;
      setTimeout(() => {
        drawGozintograph(self.graph, appendTo, containerHeight);
      }, 100);
    }
  }
};
</script>
