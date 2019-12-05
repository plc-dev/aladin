<template>
  <div class="overlay">
    <div class="overlay__close" @click="close()">&times;</div>
    <div class="overlay__content"></div>
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

/* Position the content inside the overlay */
.overlay__content {
  height: 100vh;
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 30px;
}

.overlay__close:hover,
.overlay__close:focus {
  color: black;
}

.overlay__close {
  position: absolute;
  right: 20px;
  font-size: 60px;
  z-index: 10000;
}

@media screen and (max-height: 450px) {
  .overlay__close {
    font-size: 40px;
    top: 15px;
    right: 35px;
  }
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
