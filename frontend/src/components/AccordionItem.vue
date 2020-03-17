<template>
  <div :class="`accordion__${name}--item accordion__item`">
    <div class="accordion__item--header" @click.self="toggleCollapse">
      <slot name="header">
        I'm a header!
      </slot>
    </div>
    <div class="accordion__item--content">
      <slot name="content">
        I expand on click!
      </slot>
    </div>
  </div>
</template>

<style lang="postcss">
.accordion__item {
  @apply flex flex-col justify-center items-center w-full;
}

.accordion__item--header {
  @apply flex justify-between w-full bg-contrast text-background cursor-pointer p-3;
  height: inherit;
  border-bottom: solid 1px white;
}

.accordion__item.success .accordion__item--header {
  @apply bg-success text-background;
}

.accordion__item.error .accordion__item--header {
  @apply bg-alabama_crimson text-background;
}

.accordion__item:first-child .accordion__item--header {
  /* top-left top-right bottom-right bottom-left. */
  border-radius: 5px 5px 0 0;
}

.accordion__item:last-child:not(.active) .accordion__item--header {
  border-radius: 0 0 5px 5px;
}

.accordion__item--content {
  @apply bg-white hidden pb-1;
  overflow: hidden;
  height: 0;
  transition: height 350ms ease-in-out;
}

.accordion__item.active .accordion__item--content {
  @apply flex flex-col items-center justify-center w-full;
  height: auto;
}

.accordion__item:last-child.active .accordion__item--content {
  border-radius: 0 0 5px 5px;
}

.accordion__icons {
  @apply flex justify-center items-center pl-2;
  height: inherit;
  z-index: 10;
  border-left: 1px solid white;
}

.accordion__icons > div {
  @apply px-1;
  height: inherit;
}

.accordion__item--header .accordion__icons--open {
  transform: rotate(0deg);
  transition-duration: 0.5s;
}

.accordion__item.active .accordion__item--header .accordion__icons--open {
  transform: rotate(-180deg);
  transition-duration: 0.5s;
}
</style>

<script>
export default {
  props: {
    name: { type: String, required: true }
  },
  methods: {
    toggleCollapse(event) {
      let clicked = event.target.parentElement;
      const active = document.querySelector(
        `.accordion__${this.name}--item.active`
      );
      if (!active) {
        clicked.classList.toggle("active");
        clicked.scrollIntoView({ behavior: "smooth" });
      } else if (clicked === active) active.classList.toggle("active");
      else {
        active.classList.toggle("active");
        clicked.classList.toggle("active");
        clicked.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
};
</script>
