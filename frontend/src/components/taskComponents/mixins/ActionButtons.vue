<template>
  <div class="actions">
    <button :data-id="i" v-for="(action, i) in actions" :key="i" @keydown="handleKeyboardShortcut" @click="handleAction">
      {{ action.label }}
    </button>
  </div>
</template>

<script lang="ts">
export default {
  name: "CodeEditor",
  props: {
    actionTypes: Object,
    actions: Array,
  },
  setup(props) {
    // TODO register on global object (window/html) to register, since button is not keydownable
    const handleKeyboardShortcut = (event) => {
      const actionId = event.target.dataset.id;
      const { type, instruction, keyboardShortcut, parameters } = props.actions[actionId];

      const shortcutPressed = keyboardShortcut.every(({ property, value }) => event[property] === value);

      if (shortcutPressed) props.actionTypes[type](instruction);
    };

    const handleAction = (event) => {
      const actionId = event.target.dataset.id;
      const { type, instruction, parameters } = props.actions[actionId];

      props.actionTypes[type](instruction, parameters);
    };

    return { handleAction };
  },
};
</script>

<style scoped>
button {
  background: grey;
  width: 5vw;
  height: 5vh;
  font-size: 1em;
}
</style>
