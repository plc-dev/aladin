<template>
  <div :class="`accordion__${name} accordion`">
    <slot></slot>
  </div>
</template>

<style lang="postcss">
.accordion {
  @apply flex flex-col pb-5;
  max-width: 900px;
  min-width: 50vw;
}
</style>

<script>
export default {
  props: {
    name: { type: String, required: true }
  }
};
</script>
