<template>
  <div class="path">
    <TextBox class="path__description">
      <template #header>{{ texts.task.description.header }}</template>
      <template #body>
        <p v-html="texts.task.description.body"></p>
        <Button
          :text="texts.button"
          :type="'submit'"
          @click.native="showSolution"
        ></Button>
      </template>
    </TextBox>

    <div class="show__graph">
      <img
        src="/img/icons/graph.png"
        alt="graph"
        class="show__graph--img"
        v-tooltip.right="{
          delay: {
            show: 500,
            hide: 100
          },
          content: texts.tooltip
        }"
        @click="showOverlay"
      />
    </div>

    <div class="primary" v-if="primary">
      <div>{{ texts.labels.primary }}</div>
      <Matrix
        :show="true"
        :matrix="primary"
        :yLabel="true"
        :readonly="true"
        type="primary"
      ></Matrix>
    </div>

    <div class="secondary">
      <div>{{ texts.labels.secondary }}</div>
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
import Button from "@/components/Button";
import Matrix from "@/components/exercises/gozintograph/Matrix";
import ScreenOverlay from "@/components/ScreenOverlay";
import { drawGozintograph } from "@/lib/gozintograph/drawGozintograph";
export default {
  components: {
    PathBuilder,
    TextBox,
    Matrix,
    ScreenOverlay,
    Button
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
        },
        button: texts.exercises.gozintograph.buttons.solve,
        tooltip: texts.exercises.gozintograph.tooltips.showGraph
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
    showSolution() {
      const userSecondary = Array.from(
        document.querySelectorAll(".matrix__secondary input")
      );
      const secondary = this.secondary.reduce(
        (values, nodes) => [
          ...values,
          ...Object.keys(nodes).reduce(
            (value, node) => [nodes[node][0].amount],
            []
          )
        ],
        []
      );
      document.querySelector(".pathbuilder__show--paths").click();
      document.querySelector(".pathbuilder__validate--paths").click();

      userSecondary.forEach((node, index) => {
        node.value = secondary[index];
        this.validateSecondary({ id: node.id, value: node.value });
      });
    },
    validateSecondary({ value, id }) {
      let [, index] = id.match(/.*__(\d*)_\d*/);
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
