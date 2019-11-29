<template>
  <div class="description">
    <span>asdkjasdlasjd</span>
    <div class="primary" v-if="primary">
      {{ "Primärbedarf: " }}
      <Matrix :show="true" :matrix="primary" type="primary"></Matrix>
    </div>
  </div>
</template>

<style lang="postcss">
.description {
  @apply flex flex-col pt-8 pl-8;
}

.primary {
  @apply flex items-end;
}

[class*="primary"] input {
  pointer-events: none;
}
</style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
export default {
  components: {
    Matrix
  },
  computed: {
    primary: function() {
      return this.$store.getters["gozintograph/getPrimary"];
    }
  }
};
</script>
