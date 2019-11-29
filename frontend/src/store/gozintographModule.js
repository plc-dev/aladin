export default {
  namespaced: true,

  state: {
    graph: {},
    options: [
      {
        content: "depth",
        value: 3,
        label: "Graphentiefe",
        valueType: "number",
        optionType: "value"
      },
      {
        content: "rangeAmount",
        value: {
          min: 1,
          max: 10
        },
        label: ["Primärbedarf Min", "Primärbedarf Max"],
        valueType: "number",
        optionType: "range"
      },
      {
        content: "rangeWidth",
        value: {
          min: 1,
          max: 4
        },
        label: ["Graphenbreite Min", "Graphenbreite Max"],
        valueType: "number",
        optionType: "range"
      },
      {
        content: "rangeValue",
        value: {
          min: 1,
          max: 25
        },
        label: ["Kantenwert Min", "Kantenwert Max"],
        valueType: "number",
        optionType: "range"
      }
    ]
  },
  getters: {
    getOptions(state) {
      return state.options;
    },
    getParameters(state) {
      return state.options.reduce((parameters, option) => {
        return Object.assign(parameters, { [option.content]: option.value });
      }, {});
    },
    getPrimary(state) {
      return Object.keys(state.graph).length ? [state.graph.level[0]] : null;
    }
  },
  mutations: {
    SET_OPTIONS(state, options) {
      state.options = options;
    },
    SET_GRAPH(state, graph) {
      state.graph = graph;
    }
  },
  actions: {
    updateOptions({ commit }, options) {
      commit("SET_OPTIONS", options);
    }
  }
};
