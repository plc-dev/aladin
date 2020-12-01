import axios from "axios";

export default {
    namespaced: true,

    state: {
        graph: {},
    },
    getters: {},
    mutations: {
        SET_GRAPH(state, graph) {
            state.graph= graph;
        },
    },
    actions: {
        async getGeoInterpolationGraph() {axios},

    },
};
