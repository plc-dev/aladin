<template>
  <div class="description">
    <TextBox class="solution__matrix--description">
      <template #header>{{ texts.description.header }}</template>
      <template #body>
        {{ texts.description.body }}
      </template>
    </TextBox>
  </div>
</template>

<style lang="postcss">
.description {
  @apply flex flex-col items-center justify-start w-full;
}

.solution__matrix--description {
  @apply self-center text-center m-2 pb-4;
  max-with: 96%;
}
</style>

<script>
import TextBox from "@/components/TextBox";
//@group [Gozintograph]
export default {
  components: {
    TextBox
  },
  computed: {
    texts: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographScope;
    }
  }
};
</script>
