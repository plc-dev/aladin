<template>
  <div class="taskConfiguration">
    <DifficultyPicker :componentID="props.componentID" v-if="isAdvancedUser" />
    <ParameterSelection :componentID="props.componentID" v-else />
  </div>
</template>

<script lang="ts">
import { computed, watch } from "vue";
import DifficultyPicker from "@/components/DifficultyPicker.vue";
import ParameterSelection from "@/components/ParameterSelection.vue";
import { store } from "../store/taskGraph";

export default {
  props: {
    componentID: Number,
  },
  components: {
    DifficultyPicker,
    ParameterSelection,
  },
  setup(props: { componentID: number }) {
    const isAdvancedUser = false;

    const currentNode = computed(() => store.getters.getPropertyFromPath("currentNode"));
    const taskData = computed(() => store.getters.getPropertyFromPath("taskData"));

    watch(taskData, () =>
      store.dispatch("setPropertyFromPath", { path: `nodes__${currentNode.value}__components__${props.componentID}__isValid`, value: true })
    );

    return { isAdvancedUser, props };
  },
};
</script>

<style>
.taskConfiguration {
  width: 100%;
  height: 100%;
}
</style>
