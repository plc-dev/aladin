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
  @apply flex flex-col pt-8 pl-8;
}

.primary {
  @apply flex items-end;
}

[class*="primary"] input {
  pointer-events: none;
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
