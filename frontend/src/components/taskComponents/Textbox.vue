<template>
  <div class="textbox">
    <h2>{{ header }}</h2>
    <form>
      <div class="boxed">{{ sqlresult }}</div>
    </form>
  </div>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";

export default {
  name: "Textbox",
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const componentPath = `${path}__component`;
    const dependencyPath = computed(() => getProperty(`${path}__dependencies`));

    const sqlresult = computed(() => {
      const dependency = getProperty(dependencyPath.value.Textbox.serverOutput);
      if (!dependency) return [];
      return dependency;
    });

    const header = computed(() => getProperty(`${componentPath}__header`));

    watch(sqlresult, (newValue) => {
      if (newValue != null) setProperty({ path: `${path}__isValid`, value: true });
      else setProperty({ path: `${path}__isValid`, value: false });
    });
    return { sqlresult, header };
  },
};
</script>

<style scoped>
.textbox {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.boxed {
  border: 3px solid rgb(245, 160, 2);
}
</style>
