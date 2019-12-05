<template>
  <div :class="`matrix__${type}`">
    <br v-if="!yLabel" />
    <div
      :class="`vector__${mIndex}`"
      v-for="(vectors, mIndex) in matrix"
      :key="mIndex"
    >
      <span :class="`vector__${mIndex}--label`" v-if="xLabel">{{
        Object.keys(vectors)[0]
      }}</span>
      <div
        :class="`vector__${mIndex}--row`"
        v-for="(node, vIndex) in vectors[Object.keys(vectors)[0]]"
        :key="vIndex"
      >
        {{ !mIndex && yLabel ? node.id : "" }}
        <input
          :id="`${type}__${mIndex}_${vIndex}`"
          :class="`vector__${mIndex}--value`"
          type="number"
          v-model="node.amount"
          @click="onSelect()"
          @focusout="
            $emit('validate-field', {
              value: node.amount,
              id: `${type}__${mIndex}_${vIndex}`
            })
          "
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
[class^="matrix__"] {
  @apply flex flex-col;
}

[class^="matrix__"] > div {
  @apply flex;
}

[class^="matrix__"] > div > div {
  @apply flex flex-col items-center;
}

[class^="vector__0"] span {
  margin-top: 1.7em;
}

[class^="vector__"] span {
  min-width: 20px;
  margin-right: 0.5em;
}

[class^="vector__"] [class*="--value"] {
  @apply flex w-10 border border-russet text-center;
}

[class^="vector__"] .error {
  @apply text-white_chocolate border-alabama_crimson bg-alabama_crimson;
}

[class^="vector__"] .success {
  @apply text-russet border-russet bg-success;
}
</style>

<script>
//@group [Gozintograph]
export default {
  name: "Matrix",
  props: {
    matrix: { type: Array, require: true },
    type: { type: String, require: true },
    xLabel: Boolean,
    yLabel: Boolean
  },
  data() {
    return {
      localMatrix: this.matrix
    };
  },
  methods: {
    onSelect() {
      /**
       * Selects all inside the element
       * Delay cause IE/Safari ¯\_(ツ)_/¯
       */
      setTimeout(() => {
        document.execCommand("selectall");
      }, 50);
    }
  }
};
</script>
