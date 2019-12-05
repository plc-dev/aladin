<template>
  <div class="missing__error">
    <span class="missing__error--code">404</span>
    <span>Page not found.</span>
  </div>
</template>

<style lang="postcss">
.missing__error {
  @apply flex flex-col h-full w-full justify-center items-center text-center text-textColor;
}

.missing__error--code {
  @apply text-6xl;
}
</style>
