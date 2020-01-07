<template>
  <div class="path">
    <TextBox class="path__description">
      <template #header>{{ texts.task.description.header }}</template>
      <template #body>{{ texts.task.description.body }}</template>
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

    <div class="primary" v-if="primary">
      <div>{{ texts.labels.primary }}</div>
      <Matrix
        :show="true"
        :matrix="primary"
        :readonly="true"
        type="primary"
      ></Matrix>
    </div>

    <div class="secondary">
      <div>{{ texts.labels.secondary }}</div>
      <Matrix
        :matrix="userSecondary"
        v-model="userSecondary"
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

.show__graph {
  @apply flex items-center;
}

.show__graph--img {
  @apply cursor-pointer;
  width: 50px;
  height: auto;
}

.primary,
.secondary {
  @apply flex flex-wrap items-end justify-around;
}
</style>

<script>
import PathBuilder from "@/components/exercises/gozintograph/PathBuilder";
import TextBox from "@/components/TextBox";
import Matrix from "@/components/exercises/gozintograph/Matrix";
import ScreenOverlay from "@/components/ScreenOverlay";
import { drawGozintograph } from "@/lib/gozintograph/drawGozintograph";
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
    success: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.success;
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
      let [, index] = id.match(/.*__\d*_(\d*)/);
      if (
        this.secondary[index][Object.keys(this.secondary[index])[0]][0]
          .amount == value
      ) {
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
            // this.$router.push("/exercise/gozintograph");
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
      }, 50);
    }
  }
};
</script>
