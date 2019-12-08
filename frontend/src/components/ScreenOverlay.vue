<template>
  <div class="overlay">
    <div class="overlay__close" @click="close()">&times;</div>
    <div class="overlay__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.overlay {
  @apply fixed left-0 top-0 overflow-x-hidden;
  height: 0;
  width: 100vw;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.9);
  transition: 0.5s;
}

.overlay__content {
  @apply h-screen w-screen text-center relative;
}

.overlay__close:hover,
.overlay__close:focus {
  @apply text-highlight;
}

.overlay__close {
  @apply absolute text-contrast cursor-pointer;
  font-size: 50px;
  right: 20px;
  z-index: 10000;
}
</style>

<script>
export default {
  methods: {
    close() {
      document.querySelector(".overlay").style.height = "0%";
    }
  }
};
</script>
