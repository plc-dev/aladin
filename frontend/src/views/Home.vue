<template>
  <div class="home">
    <!-- <div
      :class="`home__${keys[rowIndex]} home__block`"
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
    >
      <div
        :class="
          `home__${keys[rowIndex]}--block ${keys[rowIndex]}__block--${blockIndex}`
        "
        v-for="(block, blockIndex) in row[keys[rowIndex]]"
        :key="blockIndex"
      >
        {{ block }}
      </div>
    </div> -->
  </div>
</template>

<style lang="postcss">
.home {
  @apply flex flex-col h-full w-full justify-around;
}

.home__block {
  @apply flex flex-wrap w-full items-center justify-around;
}

.home__news {
  @apply bg-highlight;
  box-shadow: inset 0 -7px 5px -7px rgba(0, 0, 0, 0.1);
}

.home__news--block {
  @apply flex flex-col text-center;
}

.home__tutorials {
  @apply bg-contrast;
}

.home__previous {
  @apply bg-textColor;
}
</style>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      rows: [
        { news: ["#stayathome", "Corona? ;)", "test"] },
        { tutorials: ["#stayathome", "test"] },
        { previous: ["#stayathome", "Corona? ;)", "test"] }
      ],
      keys: []
    };
  },
  mounted() {
    this.keys = this.rows.reduce(
      (keys, row) => [...keys, Object.keys(row)[0]],
      []
    );
  }
};
</script>
