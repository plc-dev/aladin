<template>
  <div class="col-wrapper">
    <div :class="`matrix__${type}`">
      <div class="vector__xLabel" v-if="xLabel">
        <span
          :class="`vector__xLabel--${vIndex}`"
          v-for="(node, vIndex) in matrix[0][Object.keys(matrix[0])[0]]"
          :key="vIndex"
          >{{ node.id }}</span
        >
      </div>
      <div class="xLabel__placeholder" v-else></div>
      <div
        :class="`vector__${mIndex}`"
        v-for="(vectors, mIndex) in matrix"
        :key="mIndex"
      >
        <div
          :class="`vector__${mIndex}--row`"
          v-for="(node, vIndex) in vectors[Object.keys(vectors)[0]]"
          :key="vIndex"
        >
          <span :class="`vector__yLabel--${mIndex}`" v-if="!vIndex && yLabel">
            {{ Object.keys(vectors)[0] }}
          </span>
          <span
            :class="`vector__yLabel--placeholder`"
            v-else-if="!vIndex"
          ></span>
          <input
            :id="`${type}__${mIndex}_${vIndex}`"
            :class="`vector__${mIndex}--value`"
            type="number"
            :readonly="readonly"
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
    <slot name="bottom"></slot>
  </div>
</template>

<style lang="postcss">
.col-wrapper {
  @apply flex flex-col;
}

[class^="matrix__"] {
  @apply flex;
}

[class^="matrix__"] > div {
  @apply flex flex-col;
}

[class^="matrix__"] > div > div {
  @apply flex flex-col items-center;
}

[class^="vector__"] span {
  min-height: 28.67px;
  text-align: center;
  min-width: 28px;
}

[class^="vector__"] [class*="--value"] {
  @apply flex w-10 border border-russet text-center;
}

.vector__yLabel--placeholder {
  min-height: 26.67px;
}

.vector__xLabel {
  @apply flex h-full;
  margin-top: 28.67px;
}

.xLabel__placeholder {
  min-height: 28.67px;
  min-width: 28px;
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
    yLabel: Boolean,
    readonly: Boolean
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
