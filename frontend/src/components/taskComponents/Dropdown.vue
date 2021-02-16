<template>
  <div>
    <h2>Dropdown Menü</h2>
    <div class="dropdown">
      <button class="dropbtn">Dropdown</button>
      <div class="dropdown-content">
        <a href="#"> {{}} </a>
        <a href="#"> {{}} </a>
        <a href="#"> {{}} </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, computed, watch } from "vue";

export default {
  name: "Dropdown",
  props: {
    componentID: Number,
    storeObject: Object,
  },
  setup(props) {
    const { getProperty, setProperty } = props.storeObject;
    const currentNode = computed(() => getProperty("currentNode"));
    const path = `nodes__${currentNode.value}__components__${props.componentID}`;

    const selected = computed(() => getProperty(`${path}__component__selected`));

    watch(selected, (newValue) => {
        if (newValue != null) setProperty({path: `${path}__isValid`, value: true});
        else setProperty({path: `${path}__isValid`, value: false});
    })

    return {};
  },
};
</script>

<style scoped>
.dropbtn {
  background-color: #4CAF50;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #f1f1f1}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>
