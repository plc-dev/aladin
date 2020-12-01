<template>
  <div>{{ graph }}</div>
</template>

<script>
export default {
    methods: {
        // löst Action im Store aus
        getGeoInterpolationGraph() {
            this.$store.dispatch("interpolation/getGeoInterpolationGraph");
        },
    },
    computed: {
        graph: function() {
                    // store = store aus interpolationModule.js
                    // state = stateObjekt aus interpolationModule.js
                    // interpolation -> gibt den Namespace an aus index.js in store-Ordner
                    // graph = graph Variable aus dem store aus interpolationModule.js
            const graph = this.$store.state.interpolation.graph;
            return graph;
        },
    },
    mounted() {
        this.getGeoInterpolationGraph()
    }
}
</script>

<style>

</style>