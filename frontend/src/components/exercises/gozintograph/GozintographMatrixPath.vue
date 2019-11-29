<template>
  <div>
    tesssss
    <Matrix v-if="startMatrix" :matrix="startMatrix"></Matrix>
  </div>
</template>

<style lang="postcss"></style>

<script>
import Matrix from "@/components/exercises/gozintograph/Matrix";
export default {
  components: {
    Matrix
  },
  computed: {
    startMatrix: function() {
      return this.$store.getters["gozintograph/getStartMatrix"];
    }
  }
};
</script>
