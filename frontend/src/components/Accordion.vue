<template>
  <div :class="`accordion__${name} accordion`">
    <slot></slot>
  </div>
</template>

<style lang="postcss">
.accordion {
  @apply flex flex-col pb-5 px-3;
  max-width: 900px;
  min-width: 50vw;
}

@media (max-width: 860px) {
  .accordion {
    width: 100vw;
  }
}
</style>

<script>
export default {
  props: {
    name: { type: String, required: true }
  }
};
</script>
