<template>
  <div class="modal" @clickout="closeHandler" v-if="showModal">
    <div class="closeModal" @click="closeHandler">X</div>
    <div class="modal__header">
      <slot name="header">Insert Header here</slot>
    </div>
    <div class="modal__body">
      <slot name="body">Insert Body here</slot>
    </div>
    <div class="modal__footer">
      <slot name="footer">
        <Button :label="'Ok'" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import Button from "@/components/Button.vue";

export default {
  name: "Modal",
  props: {
    show: Boolean,
  },
  components: {
    Button,
  },
  setup(props) {
    let showModal = ref(props.show);

    const closeHandler = () => {
      showModal.value = false;
    };

    return { closeHandler, showModal };
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
