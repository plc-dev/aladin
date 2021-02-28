<template>
  <div class="parameter_form">
    <h2>{{ title }}</h2>
    <div class="parameter_form_row" v-for="(element, key) in elements" :key="key">
      <p>{{ key }}</p>
      <div class="parameter_range">
        <input
          :class="`${key}__initial__lowerValue`"
          :type="element.type"
          v-model="element.initial.lowerValue"
          :min="element.min"
          :max="element.initial.upperValue"
          @keyup="updateElement"
        />
        <input
          :class="`${key}__initial__upperValue`"
          :type="element.type"
          v-model="element.initial.upperValue"
          :min="element.initial.lowerValue"
          :max="element.max"
          @keyup="updateElement"
        />
      </div>
    </div>
    <div class="actions">
      <button :data-id="i" v-for="(action, i) in acions" :key="i" @click="handleAction">{{ action.label }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, computed } from "vue";

export default {
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { store, getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => store.state.currentNode);
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const title = getProperty(`${path}__component__title`);

    const elements = computed(() => getProperty(`${path}__component__state`));

    const updateElement = (event) => {
      const { className, value } = event.target;
      const elementPath = `${path}__component__state__${className}__value`;
      setProperty({ path: elementPath, value });
    };

    const actions = computed(() => getProperty(`${path}__component__actions`));

    const preparePayload = () => {
      const parameters: { [key: string]: any } = Object.entries(elements.value).reduce(
        (parameters, [k, v]: [string, { [key: string]: any }]) => {
          return { ...parameters, [k]: [v.initial.lowerValue, v.initial.upperValue] };
        },
        {}
      );
      const payload: { [key: string]: any } = { parameters };
      payload.type = currentTask.value;
      payload.instruction = actions.value.instruction;
      return payload;
    };

    const currentTask = computed(() => getProperty("currentTask"));

    const handleAction = (event) => {
      const actionId = event.target.dataset.id;
      const { type, instruction } = actions.value[actionId];

      actionTypes[type](instruction);
    };

    const fetchData = (instruction) =>
      store.dispatch("fetchTaskData", { payload: preparePayload(), endpoint: `${currentTask.value}/${instruction}` });

    const actionTypes = {
      fetchData,
    };

    return { elements, updateElement, handleAction, actions };
  },
};
</script>

<style>
.parameter_form {
  display: flex;
  flex-direction: column;
  background: grey;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.parameter_form_row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.parameter_form input {
  margin: 5px;
  width: 50px;
  border-radius: 5px;
  box-shadow: none;
}
</style>
