<template>
  <div>
    <span class="path__description">
      {{ "Liste alle Pfade des Graphen auf!" }}
    </span>
    <PathBuilder />
  </div>
</template>

<style lang="postcss">
.path__description {
  @apply self-center text-center pb-4;
}
</style>

<script>
import PathBuilder from "@/components/exercises/gozintograph/PathBuilder";
export default {
  components: {
    PathBuilder
  }
};
</script>
