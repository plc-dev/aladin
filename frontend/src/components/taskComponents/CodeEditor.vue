<template>
  <div :id="`editor__${componentID}`" class="codeEditor"></div>
</template>

<script lang="ts">
import { computed, onMounted, watch } from "vue";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/ext-modelist.js";
import "ace-builds/src-noconflict/theme-dracula";

export default {
  name: "CodeEditor",
  props: {
    componentID: Number,
    storeObject: Object,
    codeProp: Object,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));
    const componentPath = `nodes__${currentNode.value}__components__${props.componentID}__component`;

    const code = computed(() => {
      const path = `${componentPath}__code`;
      return JSON.stringify(props.codeProp ? props.codeProp : getProperty(path), null, "\t");
    });

    let timer;
    let editor;

    onMounted(() => {
      const modelist = ace.require("ace/ext/modelist");
      const mode = modelist.getModeForPath(".json");

      editor = ace.edit(`editor__${props.componentID}`, {
        mode: mode.mode,
        theme: "ace/theme/dracula",
        fontSize: 18,
        tabSize: 2,
        useSoftTabs: true,
      });
      editor.getSession().setValue(code.value);

      editor.on("change", () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          const content: string = editor.getValue();

          if (content && typeof content === "string" && content !== code.value) {
            Object.entries(JSON.parse(content)).forEach(([key, value]) => {
              setProperty({ path: key, value });
            });
          }
        }, 100);
      });
    });

    watch(code, () => {
      const { row, column } = editor.selection.getCursor();
      editor.getSession().setValue(code.value);
      editor.clearSelection();
      editor.gotoLine(row + 1, column);
    });

    return { code };
  },
};
</script>

<style scoped>
.codeEditor {
  width: 100%;
  height: 100%;
}
</style>
