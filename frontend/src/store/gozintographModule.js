import { retrieveMatrix, deepCopy } from "@/lib/helper";

export default {
  namespaced: true,

  state: {
    graph: {},
    currentTab: '',
    matrixPathStep: '',
    userUnitMatrix: [],
    userStartMatrix: [],
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
    getGraph(state) {
      return state.graph;
    },
    getParameters(state) {
      return state.options.reduce((parameters, option) => {
        return Object.assign(parameters, { [option.content]: option.value });
      }, {});
    },
    getPrimary(state) {
      return Object.keys(state.graph).length ? [{ Primary: state.graph.level[0] }] : null;
    },
    getPaths(state) {
      const level = deepCopy(state.graph.level);
      const connections = deepCopy(state.graph.connections);
      // retrieve every node.id per level
      const idsPerLevel = level.map(nodes => nodes.map(node => node.id));
      // retrieve every leaf.id
      const leafs = level.flatMap(nodes => nodes.filter(node => node.isLeaf).map(node => node.id));
      // get all connections from the bottom up
      const connectionsPerLevel = [];
      idsPerLevel.forEach((level, index) => {
        connectionsPerLevel.push([]);
        connections.forEach(connection =>
          level.forEach(id => {
            if (connection.child === id) {
              connectionsPerLevel[index].push(connection);
            }
          })
        );
      });
      // remove empty root level connections
      connectionsPerLevel.shift();

      let tempPaths = [];
      let paths = [];
      // get direct paths to root from leafs
      leafs.forEach(leaf => {
        connectionsPerLevel.forEach(level => {
          level.forEach(connection => {
            if (leaf === connection.child) {
              if (connection.type === "root") {
                paths.push([connection]);
              } else {
                tempPaths.push([connection]);
              }
            }
          });
        });
      });

      let temp = tempPaths;
      // concatenate paths
      connectionsPerLevel.reverse().forEach(level => {
        tempPaths = temp;
        temp = [];
        level.forEach(connection => {
          tempPaths.forEach(path => {
            // check if currently viewed connections is parent connection
            const isParent = path[path.length - 1].parent === connection.child;
            // if connection is root the path is finnished
            if (isParent && connection.type === "root") {
              paths.push([...path, connection]);
              // else view path again in next iteration
            } else if (isParent) {
              temp.push([...path, connection]);
            }
          });
        });
      });
      paths.push(...temp);
      return paths;
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
    }
  },
  actions: {
    updateOptions({ commit }, options) {
      commit("SET_OPTIONS", options);
    },
    setUserStartMatrix({state,commit}) {
      const connections = deepCopy(state.graph.connections);
      const level = deepCopy(state.graph.level);
      const nodes = level.flatMap(nodes => nodes.map(node => node));

      const matrix = retrieveMatrix(connections, nodes, 0, true);
      commit("SET_USER_START_MATRIX", matrix);
    },
    setUserUnitMatrix({state,commit}) {
      const connections = deepCopy(state.graph.connections);
      const level = deepCopy(state.graph.level);
      const nodes = level.flatMap(nodes => nodes.map(node => node));

      const matrix = retrieveMatrix(connections, nodes, 0, true);
      commit("SET_USER_UNIT_MATRIX", matrix);
    }
  }
};
