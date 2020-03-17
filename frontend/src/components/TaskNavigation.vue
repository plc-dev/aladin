<template>
  <div class="task__navigation">
    <Button
      :text="buttons.back"
      v-if="backward"
      @click.native="$emit('click-backward')"
    />
    <Button
      :text="buttons.forward"
      v-if="forward"
      @click.native="$emit('click-forward')"
    />
  </div>
</template>

<style lang="postcss">
.task__navigation {
  position: static;
  @apply flex text-center sticky my-4;
  width: 150px;
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
  },
  computed: {
    buttons: function() {
      return this.$store.state.user.texts.exercises.gozintograph.buttons;
    }
  }
};
</script>
