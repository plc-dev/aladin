<template>
  <div class="matrices__selection">
    <TextBox class="matrices__selection--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>{{ texts.description.body }}</template>
    </TextBox>

    <div class="matrices__selection--options">
      <Button
        :text="texts.options.inverse"
        @click.native="$emit('step-direction', 1)"
      />
      <Button
        :text="texts.options.multiplication"
        @click.native="$emit('step-direction', 4)"
      />
    </div>
  </div>
</template>

<style lang="postcss">
.matrices__selection--description {
  @apply self-center text-center m-2 pb-4;
}

.matrices__selection--options {
  @apply flex flex-row flex-wrap w-full justify-around text-center;
  max-width: 800px;
}

.matrices__selection--options * {
  @apply rounded p-2 mt-2;
  max-width: 150px;
}
</style>

<script>
import TextBox from "@/components/TextBox";
import Button from "@/components/Button";
export default {
  name: "MatrixPathStep0",
  components: { TextBox, Button },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath.step0;
    }
  }
};
</script>
