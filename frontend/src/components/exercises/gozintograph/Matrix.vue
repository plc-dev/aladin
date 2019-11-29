<template>
  <div :class="`matrix__${type}`">
    <div :class="`vector__${mIndex}`" v-for="(vectors, mIndex) in matrix" :key="mIndex">
      <span :class="`vector__${mIndex}--label`">{{ Object.keys(vectors)[mIndex] }}</span>
      <div
        :class="`vector__${mIndex}--row`"
        v-for="(node, vIndex) in vectors[Object.keys(vectors)[mIndex]]"
        :key="vIndex"
      >
        {{ node.id }}
        <input
          :id="`${mIndex}_${vIndex}`"
          :class="`vector__${mIndex}--value`"
          type="number"
          :value="show ? node.amount : ''"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
[class^="matrix"] {
  @apply flex flex-col;
}

[class^="matrix__"] > div {
  @apply flex;
}

[class^="matrix__"] > div > div {
  @apply flex flex-col items-center;
}

[class^="vector__"] span {
  margin-right: 0.5em;
  margin-top: 1.6em;
}

[class^="vector__"] [class*="--value"] {
  @apply flex w-10 border border-russet text-center;
}
</style>

<script>
export default {
  props: {
    matrix: { type: Array, require: true },
    type: { type: String, require: true },
    xLabel: String,
    show: Boolean
  }
};
</script>
