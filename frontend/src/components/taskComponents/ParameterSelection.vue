<template>
  <div class="parameter_form">
    <h2>{{ title }}</h2>
    <div class="parameter_form_columns">
      <div class="parameter_labels">
        <p v-for="(element, key) in elements" :key="key">{{ element.label }}</p>
      </div>
      <div class="parameter_fields">
        <component
          @updateElement="updateElement"
          :is="element.formType"
          v-for="(element, key) in elements"
          :key="key"
          :element="element"
          :elementId="key"
        />
      </div>
    </div>
    <ActionButtons :actions="actions" :actionTypes="actionTypes" />
  </div>
</template>

<script lang="ts">
import { onMounted, computed } from "vue";
import RangeFormField from "@/components/taskComponents/form/RangeFormField.vue";
import DropdownFormField from "@/components/taskComponents/form/DropdownFormField.vue";
import CheckboxFormField from "@/components/taskComponents/form/CheckboxFormField.vue";
import ActionButtons from "@/components/taskComponents/mixins/ActionButtons.vue";

export default {
  props: {
    componentID: Number,
    storeObject: Object,
  },
  components: {
    RangeFormField,
    DropdownFormField,
    CheckboxFormField,
    ActionButtons,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => store.state.currentNode);
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const title = getProperty(`${path}__component__title`);

    const elements = computed(() => getProperty(`${path}__component__form`));

    const updateElement = (event) => {
      const { className, value, type, checked } = event.target;
      const payload = type === "checkbox" ? checked : value;
      const elementPath = `${path}__component__form__${className}`;
      setProperty({ path: elementPath, value: payload });
    };

    const actions = computed(() => getProperty(`${path}__component__actions`));

    const preparePayload = (instruction) => {
      const parameters: { [key: string]: any } = Object.entries(elements.value).reduce(
        (parameters, [name, parameter]: [string, { [key: string]: any }]) => {
          const { formType, initial } = parameter;
          let payload = { ...parameters, [name]: initial };
          if (formType === "RangeFormField") payload[name] = [initial.lowerValue, initial.upperValue];
          return payload;
        },
        {}
      );
      const payload: { [key: string]: any } = { parameters };
      payload.type = currentTask.value;
      payload.task = currentTask.value;
      payload.instruction = instruction;
      return payload;
    };

    const currentTask = computed(() => getProperty("currentTask"));

    const fetchData = (instruction) =>
      store.dispatch("fetchTaskData", { payload: preparePayload(instruction), endpoint: `${currentTask.value}/${instruction}` });

    const actionTypes = {
      fetchData,
    };

    return { elements, updateElement, actions, actionTypes, title };
  },
};
</script>

<style scoped>
.parameter_form {
  display: flex;
  flex-direction: column;
  background: lightgrey;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
}

.parameter_form_columns {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
}

.parameter_fields,
.parameter_labels {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  align-items: center;
  justify-content: space-around;
}

.parameter_labels {
  align-items: start;
}
</style>
