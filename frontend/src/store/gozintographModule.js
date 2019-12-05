import { retrieveMatrix, deepCopy, deserializeLocalStorage } from "@/lib/helper";

const texts = deserializeLocalStorage(localStorage.texts);
let optionLabels = {};
let primaryText = "Primary needs vector: ";
let secondaryText = "Secondary needs vector: ";
if (texts) {
  optionLabels = texts.exercises.gozintograph.options;
  primaryText = texts.exercises.gozintograph.tabs.GozintographScope.description.primary;
  secondaryText = texts.exercises.gozintograph.tabs.GozintographScope.description.secondary;
}

export default {
  namespaced: true,

  state: {
    graph: {},
    currentTab: "",
    matrixPathStep: "",
    userUnitMatrix: [],
    userStartMatrix: [],
    userSecondaryVector: [],
    userPaths: [
      [
        {
          child: "",
          parent: "",
          value: ""
        }
      ]
    ],
    options: [
      {
        content: "depth",
        value: 3,
        label: optionLabels.depth || "Depth",
        valueType: "number",
        optionType: "value"
      },
      {
        content: "connectionThreshold",
        value: 0.7,
        label: optionLabels.connectionThreshold || "Edge Threshold",
        valueType: "number",
        float: "0.01",
        optionType: "value"
      },
      {
        content: "rangeAmount",
        value: {
          min: 1,
          max: 10
        },
        label: [
          optionLabels.rangeAmount ? optionLabels.rangeAmount.min : "Min Primary",
          optionLabels.rangeAmount ? optionLabels.rangeAmount.max : "Max Primary"
        ],
        valueType: "number",
        optionType: "range"
      },
      {
        content: "rangeWidth",
        value: {
          min: 1,
          max: 4
        },
        label: [
          optionLabels.rangeWidth ? optionLabels.rangeWidth.min : "Min Breadth",
          optionLabels.rangeWidth ? optionLabels.rangeWidth.max : "Max Breadth"
        ],
        valueType: "number",
        optionType: "range"
      },
      {
        content: "rangeValue",
        value: {
          min: 1,
          max: 25
        },
        label: [
          optionLabels.rangeValue ? optionLabels.rangeValue.min : "Min Edge Value",
          optionLabels.rangeValue ? optionLabels.rangeValue.max : "Max Edge Value"
        ],
        valueType: "number",
        optionType: "range"
      }
    ]
  },
  getters: {
    getOptions(state) {
      return state.options;
    },
    getGraph(state) {
      return state.graph;
    },
    getParameters(state) {
      return state.options.reduce((parameters, option) => {
        return Object.assign(parameters, { [option.content]: option.value });
      }, {});
    },
    getPrimary(state) {
      return Object.keys(state.graph).length ? [{ [primaryText]: state.graph.level[0] }] : null;
    },
    getStartMatrix(state) {
      const connections = deepCopy(state.graph.connections);
      const level = deepCopy(state.graph.level);
      const nodes = level.flatMap(nodes => nodes.map(node => node));

      return retrieveMatrix(connections, nodes);
    },
    getUnitMatrix(state) {
      const level = deepCopy(state.graph.level);
      const nodes = level.flatMap(nodes => nodes.map(node => node));

      return nodes.map(parent => {
        return {
          [parent.id]: nodes.map(child => {
            if (child.id === parent.id) {
              return { id: child.id, amount: 1 };
            } else {
              return { id: child.id, amount: 0 };
            }
          })
        };
      });
    },
    getSecondaryVector(state) {
      return state.graph.level.filter((level, index) => index).flat();
    },
    getUserSecondaryVector(state, getters) {
      const secondary = deepCopy(getters.getSecondaryVector);
      const userSecondary = secondary.map(node => {
        node.amount = "";
        return node;
      });
      return [{ [secondaryText]: userSecondary }];
    }
  },
  mutations: {
    SET_OPTIONS(state, options) {
      state.options = options;
    },
    SET_GRAPH(state, graph) {
      state.graph = graph;
    },
    SET_CURRENT_TAB(state, tab) {
      state.currentTab = tab;
    },
    SET_USER_START_MATRIX(state, matrix) {
      state.userStartMatrix = matrix;
    },
    SET_USER_UNIT_MATRIX(state, matrix) {
      state.userUnitMatrix = matrix;
    },
    SET_MATRIX_PATH_STEP(state, step) {
      state.matrixPathStep = step;
    },
    SET_USER_PATHS(state, paths) {
      state.userPaths = paths;
    }
  },
  actions: {
    updateOptions({ commit }, options) {
      commit("SET_OPTIONS", options);
    },
    setUserStartMatrix({ state, commit }) {
      const connections = deepCopy(state.graph.connections);
      const level = deepCopy(state.graph.level);
      const nodes = level.flatMap(nodes => nodes.map(node => node));

      const matrix = retrieveMatrix(connections, nodes, 0, true);
      commit("SET_USER_START_MATRIX", matrix);
    },
    setUserUnitMatrix({ state, commit }) {
      const connections = deepCopy(state.graph.connections);
      const level = deepCopy(state.graph.level);
      const nodes = level.flatMap(nodes => nodes.map(node => node));

      const matrix = retrieveMatrix(connections, nodes, 0, true);
      commit("SET_USER_UNIT_MATRIX", matrix);
    },
    setGraph({ commit, dispatch }, graph) {
      commit("SET_GRAPH", graph);
      commit("SET_USER_PATHS", [
        [
          {
            child: "",
            parent: "",
            value: ""
          }
        ]
      ]);

      dispatch("setUserStartMatrix");
      dispatch("setUserUnitMatrix");
    }
  }
};
