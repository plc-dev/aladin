import {
  retrieveMatrix,
  deepCopy,
  deserializeLocalStorage
} from "@/lib/helper";

const texts = deserializeLocalStorage(localStorage.texts);
let optionLabels = {};
if (texts) {
  optionLabels = texts.exercises.gozintograph.options;
}

export default {
  namespaced: true,

  state: {
    graph: {},
    currentTab: "",
    matrixPathStep: "",
    userUnitMatrix: [],
    userDirectMatrix: [],
    userSubtractedMatrix: [],
    userSubtractedMatrix2: [],
    userSecondaryVector: [],
    userInvertedMatrix: [],
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
          optionLabels.rangeAmount
            ? optionLabels.rangeAmount.min
            : "Min Primary",
          optionLabels.rangeAmount
            ? optionLabels.rangeAmount.max
            : "Max Primary"
        ],
        valueType: "number",
        optionType: "range"
      },
      {
        content: "rangeWidth",
        value: {
          min: 1,
          max: 3
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
          max: 10
        },
        label: [
          optionLabels.rangeValue
            ? optionLabels.rangeValue.min
            : "Min Edge Value",
          optionLabels.rangeValue
            ? optionLabels.rangeValue.max
            : "Max Edge Value"
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
      return state.graph.level[0].map(node => ({ [node.id]: [node] }));
    },
    getFullPrimary(state) {
      return state.graph.level.reduce(
        (vector, level, lIndex) => {
          if (!lIndex) {
            vector[0]["P"].push(...level);
          } else {
            vector[0]["P"].push(
              ...level.flatMap(node => ({ id: node.id, amount: 0 }))
            );
          }
          return vector;
        },
        [{ P: [] }]
      );
    },
    getSecondaryVector(state) {
      return state.graph.level
        .filter((level, index) => index)
        .flat()
        .map(node => ({ [node.id]: [node] }));
    },
    getFullSecondary(state) {
      return state.graph.level.reduce(
        (vector, level) => {
          vector[0]["S"].push(...level.flatMap(node => node));
          return vector;
        },
        [{ S: [] }]
      );
    },
    getUserSecondaryVector(state, getters) {
      const secondary = deepCopy(getters.getSecondaryVector);
      return secondary.map(node => {
        node[Object.keys(node)[0]][0].amount = "";
        return node;
      });
    },
    getUserSecondaryFullVector(state, getters) {
      const secondary = deepCopy(getters.getFullSecondary);
      secondary.forEach(vector =>
        vector[Object.keys(vector)[0]].forEach(node => (node.amount = ""))
      );
      return secondary;
    },
    getDirectMatrix(state) {
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
    getSubtractedMatrix(state, getters) {
      const directMatrix = getters.getDirectMatrix;
      const unitMatrix = getters.getUnitMatrix;
      const subtractedMatrix = deepCopy(getters.getDirectMatrix);
      for (let i = 0; i < directMatrix.length; i++) {
        const directVector = directMatrix[i];
        const unitVector = unitMatrix[i];
        const subtractedVector = subtractedMatrix[i];
        const vectorKey = Object.keys(directVector)[0];
        for (let j = 0; j < directMatrix.length; j++) {
          subtractedVector[vectorKey][j].amount =
            unitVector[vectorKey][j].amount - directVector[vectorKey][j].amount;
        }
      }
      return subtractedMatrix;
    },
    getUserDirectMatrices(state, getters) {
      let amount = getters.getMaxPathLength;
      let matrices = [];
      const graph = state.graph;
      const connections = graph.connections;
      const nodes = graph.level.flatMap(level => level.map(node => node));
      while (amount > 1) {
        matrices.push(retrieveMatrix(connections, nodes, 0, true));
        amount--;
      }
      return matrices;
    },
    getMaxPathLength(state) {
      return state.graph.paths.reduce((max, path) => {
        return max > path.length ? max : path.length;
      }, 0);
    },
    getUserAggregatedMatrix(state) {
      const graph = state.graph;
      const connections = graph.connections;
      const nodes = graph.level.flatMap(level => level.map(node => node));
      return retrieveMatrix(connections, nodes, 0, true);
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
    SET_USER_DIRECT_MATRIX(state, matrix) {
      state.userDirectMatrix = matrix;
    },
    SET_USER_UNIT_MATRIX(state, matrix) {
      state.userUnitMatrix = matrix;
    },
    SET_USER_SUBTRACTED_MATRIX(state, matrix) {
      state.userSubtractedMatrix = matrix;
    },
    SET_USER_INVERTED_MATRIX(state, matrix) {
      state.userInvertedMatrix = matrix;
    },
    SET_MATRIX_PATH_STEP(state, step) {
      state.matrixPathStep = step;
    },
    SET_USER_PATHS(state, paths) {
      state.userPaths = paths;
    },
    CLEAR_STATE(state) {
      state.graph = {};
      state.currentTab = "";
      state.matrixPathStep = "";
      state.userUnitMatrix = [];
      state.userDirectMatrix = [];
      state.userSubtractedMatrix = [];
      state.userSubtractedMatrix2 = [];
      state.userSecondaryVector = [];
      state.userInvertedMatrix = [];
      state.userPaths = [
        [
          {
            child: "",
            parent: "",
            value: ""
          }
        ]
      ];
    }
  },

  actions: {
    updateOptions({ commit }, options) {
      commit("SET_OPTIONS", options);
    },
    setUserMatrices({ state, commit }) {
      const connections = deepCopy(state.graph.connections);
      const level = deepCopy(state.graph.level);
      const nodes = level.flatMap(nodes => nodes.map(node => node));

      const unitMatrix = retrieveMatrix(connections, nodes, 0, true);
      const directMatrix = deepCopy(unitMatrix);
      const subtractedMatrix = deepCopy(unitMatrix);
      const invertedMatrix = deepCopy(unitMatrix);
      commit("SET_USER_UNIT_MATRIX", unitMatrix);
      commit("SET_USER_DIRECT_MATRIX", directMatrix);
      commit("SET_USER_SUBTRACTED_MATRIX", subtractedMatrix);
      commit("SET_USER_INVERTED_MATRIX", invertedMatrix);
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

      dispatch("setUserMatrices");
    }
  }
};
