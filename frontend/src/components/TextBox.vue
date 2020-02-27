<template>
  <div class="textbox">
    <div class="textbox__header">
      <slot name="header"></slot>
    </div>
    <div class="textbox__body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<style lang="postcss">
.textbox {
  @apply flex flex-col border-solid border-2 border-contrast bg-background text-textColor rounded shadow-lg;
}

.textbox__header {
  @apply w-full bg-contrast text-background rounded-t-sm text-center h-10;
  text-shadow: 1px 1px 1px #000;
}

.textbox__body {
  @apply self-center justify-center text-center bg-background text-textColor text-sm p-4 w-full;
}

.textbox [class*="button"] {
  @apply m-auto mt-2;
}
</style>

<script>
export default {
  name: "Textbox"
};
</script>
