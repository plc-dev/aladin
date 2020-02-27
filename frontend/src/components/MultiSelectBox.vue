<template>
  <div :class="`multiselect__${name} multiselect`">
    <div :class="`multiselect__${name}--box multiselect__box`">
      <div
        :class="`multiselect__${name}--title multiselect__title`"
        v-for="selectable in selectables"
        :key="selectable.title"
        @click="setActive"
      >
        {{ selectable.title }}
      </div>
    </div>
    <div
      v-for="(selectable, index) in selectables"
      :key="index"
      :class="`multiselect__${name}--content multiselect__content`"
    >
      <div v-show="index == selected">
        <slot :name="selectable.slot">{{ index }} </slot>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.multiselect {
  @apply flex flex-col pb-5 items-center h-full;
}

.multiselect__box {
  @apply flex flex-row justify-center items-center h-12 mb-5;
  -webkit-box-shadow: 2px 3px 9px 0px rgba(0, 0, 0, 1);
  -moz-box-shadow: 2px 3px 9px 0px rgba(0, 0, 0, 1);
  box-shadow: 2px 3px 9px 0px rgba(0, 0, 0, 1);
  border-radius: 10px 10px 10px 10px;
}

.multiselect__title {
  @apply bg-main p-3 border-r-2 border-background text-textColor cursor-pointer;
}

.multiselect__title:first-child {
  /* top-left top-right bottom-right bottom-left.  */
  border-radius: 10px 0 0 10px;
}

.multiselect__title:last-child {
  @apply border-r-0;
  /* top-left top-right bottom-right bottom-left.  */
  border-radius: 0 10px 10px 0;
}

.multiselect__title:hover {
  @apply bg-highlight;
}

.multiselect__title.active {
  @apply bg-contrast text-highlight cursor-default;
}
</style>

<script>
export default {
  data: function() {
    return {
      selected: -1
    };
  },
  props: {
    name: { type: String, required: true },
    selectables: { type: Array, required: true }
  },
  methods: {
    setActive: function(event) {
      const currentActive = document.querySelectorAll(
        ".multiselect__title.active"
      );
      if (currentActive.length) currentActive[0].classList.remove("active");
      event.target.classList.add("active");

      const selected = Array.from(
        document.querySelectorAll(".multiselect__title")
      ).findIndex(element => element.classList.contains("active"));
      this.selected = selected;
    }
  }
};
</script>
