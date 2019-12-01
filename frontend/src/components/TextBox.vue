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
  @apply flex flex-col border-solid border-2 border-russet bg-white_chocolate text-white_chocolate rounded shadow-lg;
}

.textbox__header {
  @apply w-full bg-russet rounded-t-sm text-center h-10;
  text-shadow: 1px 1px 1px #000;
}

.textbox__body {
  @apply self-center justify-center text-center bg-white_chocolate text-russet;
}
</style>

<script>
export default {
  name: "Textbox"
};
</script>
