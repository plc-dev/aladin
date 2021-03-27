<template>
  <div class="branches">
    <FolderTabs :tabs="tabs"></FolderTabs>
  </div>
</template>

<script lang="ts">
import FolderTabs from "@/components/FolderTabs.vue";
import { onMounted, ref } from "vue";

export default {
  components: { FolderTabs },
  props: { storeObject: Object },
  setup(props) {
    const { getProperty, setProperty } = props.storeObject;
    const currentNode = getProperty("currentNode");
    const pathDescriptions: { [key: string]: { title: string; image: string; description: string } } = getProperty(
      `nodes__${currentNode}__pathDescriptions`
    );

    // TODO: maybe add back button as a fixed element in top right corner

    const navHandler = (event) => {
      const button: HTMLElement = event.target;
      const nodeId = button.dataset.id;
      setProperty({ path: "previousNode", value: currentNode });
      setProperty({ path: "currentNode", value: nodeId });
    };

    const tabs = Object.entries(pathDescriptions).map(([nodeId, pathDescription]) => {
      return { data: { value: nodeId, name: "id" }, handler: navHandler, ...pathDescription };
    });

    return { tabs };
  },
};
</script>

<style scoped>
.decisions {
  display: flex;
  flex-direction: row;
  justify-items: space-evenly;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.branch {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px dotted black;
  z-index: 2;
}
</style>
