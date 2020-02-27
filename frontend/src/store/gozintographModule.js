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

const presenterGozintographs = [
  {
    level: [
      [
        { id: "P0", amount: 10, need: 10, isLeaf: false, needAdded: false },
        { id: "P1", amount: 2, need: 2, isLeaf: false, needAdded: false }
      ],
      [
        { id: "K0", amount: 68, need: 8, isLeaf: true, needAdded: true },
        { id: "B1", amount: 31, need: 1, isLeaf: false, needAdded: true },
        { id: "K1", amount: 13, need: 3, isLeaf: true, needAdded: true }
      ],
      [{ id: "R0", amount: 147, need: 9, isLeaf: true, needAdded: true }]
    ],
    connections: [
      { parent: "P0", child: "K0", value: 6, type: "root" },
      { parent: "P0", child: "B1", value: 3, type: "root" },
      { parent: "P1", child: "K1", value: 5, type: "root" },
      { parent: "P1", child: "R0", value: 7, type: "root" },
      { parent: "B1", child: "R0", value: 4, type: "" }
    ],
    paths: [
      [{ parent: "P0", child: "K0", value: 6, type: "root" }],
      [{ parent: "P1", child: "K1", value: 5, type: "root" }],
      [{ parent: "P1", child: "R0", value: 7, type: "root" }],
      [
        { parent: "B1", child: "R0", value: 4, type: "" },
        { parent: "P0", child: "B1", value: 3, type: "root" }
      ]
    ],
    depth: 3
  },
  {
    level: [
      [
        { id: "P0", amount: 2, need: 2, isLeaf: false, needAdded: false },
        { id: "P1", amount: 10, need: 10, isLeaf: false, needAdded: false }
      ],
      [
        { id: "R0", amount: 110, need: 10, isLeaf: true, needAdded: true },
        { id: "B1", amount: 28, need: 10, isLeaf: false, needAdded: true },
        { id: "B2", amount: 6, need: 2, isLeaf: false, needAdded: true }
      ],
      [
        { id: "R1", amount: 36, need: 6, isLeaf: true, needAdded: true },
        { id: "K0", amount: 63, need: 3, isLeaf: true, needAdded: true }
      ]
    ],
    connections: [
      { parent: "P1", child: "R0", value: 10, type: "root" },
      { parent: "P0", child: "B1", value: 9, type: "root" },
      { parent: "P0", child: "B2", value: 2, type: "root" },
      { parent: "P0", child: "R1", value: 1, type: "root" },
      { parent: "B1", child: "R1", value: 1, type: "" },
      { parent: "P1", child: "K0", value: 3, type: "root" },
      { parent: "B2", child: "K0", value: 5, type: "" }
    ],
    paths: [
      [{ parent: "P1", child: "R0", value: 10, type: "root" }],
      [{ parent: "P0", child: "R1", value: 1, type: "root" }],
      [
        { parent: "B1", child: "R1", value: 1, type: "" },
        { parent: "P0", child: "B1", value: 9, type: "root" }
      ],
      [{ parent: "P1", child: "K0", value: 3, type: "root" }],
      [
        { parent: "B2", child: "K0", value: 5, type: "" },
        { parent: "P0", child: "B2", value: 2, type: "root" }
      ]
    ],
    depth: 3
  },
  {
    level: [
      [
        { id: "P0", amount: 8, need: 8, isLeaf: false, needAdded: false },
        { id: "P1", amount: 6, need: 6, isLeaf: false, needAdded: false },
        { id: "P2", amount: 8, need: 8, isLeaf: false, needAdded: false }
      ],
      [
        { id: "K0", amount: 34, need: 4, isLeaf: true, needAdded: true },
        { id: "K1", amount: 83, need: 3, isLeaf: true, needAdded: true },
        { id: "B2", amount: 49, need: 1, isLeaf: false, needAdded: true }
      ],
      [{ id: "K2", amount: 226, need: 4, isLeaf: true, needAdded: true }]
    ],
    connections: [
      { parent: "P1", child: "K0", value: 5, type: "root" },
      { parent: "P0", child: "K1", value: 10, type: "root" },
      { parent: "P1", child: "B2", value: 8, type: "root" },
      { parent: "P0", child: "K2", value: 6, type: "root" },
      { parent: "P1", child: "K2", value: 6, type: "root" },
      { parent: "P2", child: "K2", value: 5, type: "root" },
      { parent: "B2", child: "K2", value: 2, type: "" }
    ],
    paths: [
      [{ parent: "P1", child: "K0", value: 5, type: "root" }],
      [{ parent: "P0", child: "K1", value: 10, type: "root" }],
      [{ parent: "P0", child: "K2", value: 6, type: "root" }],
      [{ parent: "P1", child: "K2", value: 6, type: "root" }],
      [{ parent: "P2", child: "K2", value: 5, type: "root" }],
      [
        { parent: "B2", child: "K2", value: 2, type: "" },
        { parent: "P1", child: "B2", value: 8, type: "root" }
      ]
    ],
    depth: 3
  },
  {
    level: [
      [
        { id: "P0", amount: 1, need: 1, isLeaf: false, needAdded: false },
        { id: "P1", amount: 1, need: 1, isLeaf: false, needAdded: false }
      ],
      [
        { id: "K0", amount: 18, need: 9, isLeaf: true, needAdded: true },
        { id: "B1", amount: 9, need: 1, isLeaf: false, needAdded: true },
        { id: "B2", amount: 15, need: 8, isLeaf: false, needAdded: true }
      ],
      [{ id: "B3", amount: 29, need: 4, isLeaf: false, needAdded: true }],
      [{ id: "K1", amount: 424, need: 10, isLeaf: true, needAdded: true }]
    ],
    connections: [
      { parent: "P1", child: "K0", value: 9, type: "root" },
      { parent: "P0", child: "B1", value: 8, type: "root" },
      { parent: "P0", child: "B2", value: 1, type: "root" },
      { parent: "P1", child: "B2", value: 6, type: "root" },
      { parent: "P0", child: "B3", value: 7, type: "root" },
      { parent: "B1", child: "B3", value: 2, type: "" },
      { parent: "P1", child: "K1", value: 4, type: "root" },
      { parent: "B2", child: "K1", value: 8, type: "" },
      { parent: "B3", child: "K1", value: 10, type: "" }
    ],
    paths: [
      [{ parent: "P1", child: "K0", value: 9, type: "root" }],
      [{ parent: "P1", child: "K1", value: 4, type: "root" }],
      [
        { parent: "B2", child: "K1", value: 8, type: "" },
        { parent: "P0", child: "B2", value: 1, type: "root" }
      ],
      [
        { parent: "B2", child: "K1", value: 8, type: "" },
        { parent: "P1", child: "B2", value: 6, type: "root" }
      ],
      [
        { parent: "B3", child: "K1", value: 10, type: "" },
        { parent: "P0", child: "B3", value: 7, type: "root" }
      ],
      [
        { parent: "B3", child: "K1", value: 10, type: "" },
        { parent: "B1", child: "B3", value: 2, type: "" },
        { parent: "P0", child: "B1", value: 8, type: "root" }
      ]
    ],
    depth: 4
  },
  {
    level: [
      [
        { id: "P0", amount: 7, need: 7, isLeaf: false, needAdded: false },
        { id: "P1", amount: 6, need: 6, isLeaf: false, needAdded: false }
      ],
      [
        { id: "K0", amount: 90, need: 6, isLeaf: true, needAdded: true },
        { id: "R0", amount: 33, need: 9, isLeaf: true, needAdded: true }
      ]
    ],
    connections: [
      { parent: "P0", child: "K0", value: 6, type: "root" },
      { parent: "P1", child: "K0", value: 7, type: "root" },
      { parent: "P1", child: "R0", value: 4, type: "root" }
    ],
    paths: [
      [{ parent: "P0", child: "K0", value: 6, type: "root" }],
      [{ parent: "P1", child: "K0", value: 7, type: "root" }],
      [{ parent: "P1", child: "R0", value: 4, type: "root" }]
    ],
    depth: 2
  }
];

export default {
  namespaced: true,

  state: {
    presenterGozintographs: presenterGozintographs,
    presenterGozintographIndex: 0,
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
      return state.graph.level
        .reduce((nodes, level) => (nodes = [...nodes, ...level]), [])
        .flatMap(node => ({
          [node.id]: [{ id: node.id, amount: node.need, isLeaf: node.isLeaf }]
        }));
    },
    getFullPrimary(state) {
      return state.graph.level.reduce(
        (vector, level, lIndex) => {
          if (!lIndex) {
            vector[0]["P"].push(...level);
          } else {
            vector[0]["P"].push(
              ...level.flatMap(node => ({ id: node.id, amount: node.need }))
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
    SET_GOZINTOGRAPH_PRESENTER_INDEX(state) {
      const current = state.presenterGozintographIndex;
      const max = state.presenterGozintographs.length - 1;
      if (current === max) {
        state.presenterGozintographIndex = 0;
      } else {
        state.presenterGozintographIndex++;
      }
    },
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
