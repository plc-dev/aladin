<template>
  <nav class="navigation">
    <div class="traverse backward" data-direction="backward" :data-to="previous" @click="navigate"></div>
    <div class="traverse forward" data-direction="forward" :data-to="next" @click="navigate"></div>
  </nav>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";

export default {
  props: {
    nextNode: Number,
    storeObject: Object,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    const router = useRouter();
    const rootNode = getProperty("rootNode");
    const currentNode = getProperty("currentNode");
    const next = props.nextNode ? props.nextNode : getProperty("edges")[currentNode];
    const previous = getProperty("previousNode");

    const componentValidities = computed(() => {
      const edges = getProperty("edges");
      if (edges && edges[currentNode]) {
        if (edges[currentNode].length > 1) return [true];
        return Object.values(getProperty(`nodes__${currentNode}__components`)).map((component: any) => component.isValid);
      }
      return [false];
    });

    const validate = () => {
      const navForward = document.querySelector(".traverse.forward");
      if (componentValidities.value.every((validity) => validity)) {
        navForward.classList.remove("forbidden");
      } else if (navForward) {
        navForward.classList.add("forbidden");
      }
    };

    onMounted(() => {
      validate();
    });

    watch(componentValidities, validate);

    const navigate = (event) => {
      const navElement = event.target;
      const { direction, to } = navElement.dataset;

      if (currentNode === rootNode && direction === "backward") {
        router.push({ name: "TaskOverview" });
      } else if (!Array.from(navElement.classList).includes("forbidden")) {
        setProperty({ path: "previousNode", value: currentNode });
        setProperty({ path: "currentNode", value: to });
      }
    };

    return { navigate, next, previous };
  },
};
</script>

<style scoped>
.navigation {
  width: inherit;
  max-width: inherit;
}

.traverse {
  position: fixed;
  height: 5vh;
  width: inherit;
  max-width: inherit;
  cursor: pointer;
  z-index: 1;
  /* https://blog.prototypr.io/stunning-hover-effects-with-css-variables-f855e7b95330
  background: radial-gradient(circle closest-side, #f32, transparent);
  transform: translate(-50%, -50%);
  transition: 20 .2s ease, 20 .2s ease; */
}

.backward {
  top: 0;
  background: linear-gradient(0deg, transparent 0%, rgba(0, 153, 51, 0.5) 100%);
}

.forward {
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 153, 51, 0.5) 100%);
}

.forbidden {
  background: linear-gradient(180deg, transparent 0%, rgb(228, 58, 58, 0.5) 100%);
}
</style>
