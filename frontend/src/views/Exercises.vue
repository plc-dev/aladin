<template>
  <div class="exercises">
    <router-link
      class="exercises__exercise"
      v-for="(exercise, key) in exercises"
      :key="key"
      :to="`exercise/${exercise.alt}`"
    >
      <img
        class="exercises__exercise--img"
        :src="exercise.img"
        :alt="exercise.alt"
      />
      <span class="exercises__exercise--description">{{ exercise.body }}</span>
    </router-link>

    <router-link
      class="exercises__exercise"
      v-for="(exercise, key) in exercises"
      :key="key"
      :to="`exercise/${exercise.alt}`"
    >
      <img
        class="exercises__exercise--img"
        :src="exercise.img"
        :alt="exercise.alt"
      />
      <span class="exercises__exercise--description">{{ exercise.body }}</span>
    </router-link>

    <router-link
      class="exercises__exercise"
      v-for="(exercise, key) in exercises"
      :key="key"
      :to="`exercise/${exercise.alt}`"
    >
      <img
        class="exercises__exercise--img"
        :src="exercise.img"
        :alt="exercise.alt"
      />
      <span class="exercises__exercise--description">{{ exercise.body }}</span>
    </router-link>
  </div>
</template>

<style lang="postcss">
.exercises {
  @apply flex flex-wrap justify-center items-center h-full overflow-auto;
}

.exercises__exercise {
  @apply flex flex-wrap justify-center items-center bg-main p-5 m-5 rounded shadow-md cursor-pointer;
  position: relative;
  text-align: center;
  -webkit-transition: margin 0.5s ease-out;
  -moz-transition: margin 0.5s ease-out;
  -o-transition: margin 0.5s ease-out;
  max-width: 500px;
}

.exercises__exercise:hover {
  margin-top: 5px;
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.8);
}

.exercises__exercise--img {
  @apply h-32 w-auto shadow-md;
}

.exercises__exercise--description {
  @apply p-4 m-2 text-textColor text-sm bg-background border-contrast rounded shadow-md;
}
</style>

<script>
export default {
  name: "Exercises",
  computed: {
    exercises: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.overview;
    }
  }
};
</script>
