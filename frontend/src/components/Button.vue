<template>
  <div :class="`button--${type}`">{{ text }}</div>
</template>

<style lang="postcss">
[class*="button--"] {
  @apply bg-contrast text-background;
  transition: 0.25s;

  &:hover,
  &:focus {
    @apply border-highlight text-highlight;
    box-shadow: 0 0.5em 0.5em -0.4em highlight;
    transform: translateY(-0.25em);
  }
}

.button--submit {
  @apply bg-contrast text-background w-32 rounded text-sm text-center align-middle cursor-pointer;
  max-height: 50px;
  line-height: 50px;
}
</style>

<script>
export default {
  props: {
    type: String,
    text: String
  }
};
</script>
