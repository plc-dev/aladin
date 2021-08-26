<template>
  <div class="modal" @clickout="closeHandler" v-if="modal.active">
    <div class="closeModal" @click="closeHandler">X</div>
    <div class="modal__header"></div>
    <div class="modal__body"></div>
    <div class="modal__footer">
      <Button v-for="(button, i) in modal.content.footer" :key="i" :label="button.label" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import Button from "@/components/Button.vue";

export default {
  name: "Modal",
  props: { storeObject: Object, modalIndex: Number },
  components: {
    Button,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    const currentNode = store.state.currentNode;

    const modalPath = `nodes__${currentNode}__modals__${props.modalIndex}`;
    const modal = computed(() => getProperty(modalPath));

    const closeHandler = () => {
      setProperty({ path: `${modalPath}__active`, value: !modal.value.active });
    };

    return { closeHandler, modal };
  },
};
</script>

<style scoped>
.modal {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 30vw;
  height: 40vh;
  justify-content: space-between;
  align-items: center;
  background: #f1ad2d; /*57636b  f1ad2d*/
  z-index: 99;
  border: 1px solid black;
  border-radius: 2px;
  box-shadow: 2px 3px 9px 0px rgba(0, 0, 0, 1);
  color: #57636b;
}

.modal__header {
  font-size: 30px;
  font-weight: bolder;
}

.modal__footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding-bottom: 5px;
}

.closeModal {
  position: absolute;
  top: 2px;
  right: 2px;
  padding: 5px;
  border: 1px solid black;
  box-shadow: 2px 3px 9px 0px rgba(0, 0, 0, 1);
  background: #57636b;
  color: white;
  cursor: pointer;
}
</style>
