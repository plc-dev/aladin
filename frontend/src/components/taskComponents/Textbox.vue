<template>
  <div>
    <h2>{{ header }}</h2>
<form>
  <label for="answer"> {{answer}} </label>
  <div class="boxed">
  {{ sqlresult }}
</div>  
</form>
  </div>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";

export default {
  name: "Textbox",
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const componentPath =  `${path}__component`;
    const dependencyPath = computed(() => getProperty(`${path}__dependency`));

    const sqlresult = computed(() => {
    const dependency = getProperty(dependencyPath.value);
      if (!dependency) return [];
      return dependency;
    });

    const header = computed(() => getProperty(`${componentPath}__header`));
    const answer = computed(() => getProperty(`${componentPath}__answer`));


    watch(sqlresult, (newValue) => {
        if (newValue != null) setProperty({path: `${path}__isValid`, value: true});
        else setProperty({path: `${path}__isValid`, value: false});
    })
    return {sqlresult, answer, header};
  },
};
</script>

<style scoped>
/*input[type=text] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 2px solid orange;
  border-radius: 4px;
} */
.boxed {
  border: 3px solid rgb(245, 160, 2) ;
}
</style>