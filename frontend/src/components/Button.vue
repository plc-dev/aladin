<template>
  <div :class="`button--${type}`">{{ text }}</div>
</template>

<style lang="postcss">
.button--submit {
  @apply bg-russet text-white_chocolate w-32 rounded text-center align-middle cursor-pointer;
  max-height: 50px;
  line-height: 50px;
}

button {
  color: russet;
  transition: 0.25s;

  &:hover,
  &:focus {
    border-color: white_chocolate;
    color: #fff;
  }
}

.button:hover,
.button:focus {
  box-shadow: 0 0.5em 0.5em -0.4em green;
  transform: translateY(-0.25em);
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
