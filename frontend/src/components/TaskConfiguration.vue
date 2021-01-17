<template>
  <div class="taskConfiguration">
    <DifficultyPicker :componentID="props.componentID" v-if="isAdvancedUser" />
    <ParameterSelection :componentID="props.componentID" v-else />
  </div>
</template>

<script lang="ts">
import { onMounted, toRefs, ref, watch } from "vue";
import DifficultyPicker from "@/components/DifficultyPicker.vue";
import ParameterSelection from "@/components/ParameterSelection.vue";

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
