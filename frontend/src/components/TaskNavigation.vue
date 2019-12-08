<template>
  <div class="task__navigation">
    <Button
      :text="'Zurück'"
      v-if="backward"
      @click.native="$emit('click-backward')"
    />
    <Button
      :text="'Weiter'"
      v-if="forward"
      @click.native="$emit('click-forward')"
    />
  </div>
</template>

<style lang="postcss">
.task__navigation {
  @apply flex text-center absolute;
  width: 150px;
  bottom: 10px;
  right: 10px;
}

.task__navigation * {
  @apply rounded mr-2;
}
</style>

<script>
import Button from "@/components/Button";
export default {
  components: {
    Button
  },
  props: {
    forward: Boolean,
    backward: Boolean
  }
};
</script>
