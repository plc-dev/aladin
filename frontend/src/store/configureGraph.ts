import { createStore, createLogger } from "vuex";
import { Matrix } from "../helpers/LinearAlgebra";
import axios from "axios";
import { IState } from "@/interfaces/TaskGraphInterface";

const state: IState = {
  currentTask: "Dummy",
  layoutSize: "lg",
  currentNode: 0,
  previousNode: 0,
  rootNode: 0,
  topology: new Matrix([]),
  edges: {},
  nodes: {
    0: {
      zoomScale: 1,
      layouts: {
        sm: [
          {
            x: 12,
            y: 5,
            w: 2,
            h: 5,
            i: 2,
            static: false,
          },
        ],
        md: [
          {
            x: 0,
            y: 10,
            w: 2,
            h: 5,
            i: 2,
            static: false,
          },
        ],
        lg: [
          {
            x: 18,
            y: 15,
            w: 2,
            h: 2,
            i: 3,
            static: false,
          },
        ],
      },
      components: {
        3: {
          type: "BackgroundGraph",
          name: "Gozintograph",
          isValid: true,
          dependencies: {
            ContourPlot: { grid: "taskData__grid", thresholds: "taskData__thresholds" },
            DOTGraph: "taskData__dotDescription",
          },
          component: {},
        },
      },
    },
  },
  taskData: {
    grid: [
      [90, 95, 104, 105, 105],
      [106, 106, 106, 107, 107],
      [106, 106, 105, 105, 104],
      [104, 104, 104, 105, 107],
      [75, 99, 102, 109, 90],
    ],
    thresholds: [90, 95, 100, 105],
    nodes: {
      "0": { id: 0, isLeaf: false, label: "P0", value: 5 },
      "1": { id: 1, isLeaf: false, label: "P1", value: 6 },
      "2": { id: 2, isLeaf: true, label: "K0", value: 1 },
      "3": { id: 3, isLeaf: true, label: "K1", value: 5 },
      "4": { id: 4, isLeaf: true, label: "R0", value: 5 },
    },
    edges: [
      { between: [2, 1], weight: 2 },
      { between: [3, 1], weight: 3 },
      { between: [4, 1], weight: 9 },
      { between: [3, 0], weight: 6 },
    ],
    idGenerator: {},
    isDirected: true,
    topology: [
      [0, 1],
      [2, 3, 4],
    ],
    paths: [
      [{ between: [3, 0], weight: 6 }],
      [{ between: [2, 1], weight: 2 }],
      [{ between: [3, 1], weight: 3 }],
      [{ between: [4, 1], weight: 9 }],
    ],
    adjacencyMatrix: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [6, 3, 0, 0, 0],
      [0, 9, 0, 0, 0],
    ],
    valueVector: [[5, 6, 1, 5, 5]],
    labelVector: ["P0", "P1", "K0", "K1", "R0"],
    dotDescription:
      `\n            digraph\n {\n            node [shape="circle" style="filled"]` +
      `edge [dir="back"]\n\n             P1 -> K0 [label=" 2"]\n P1 -> K1 [label=" 3"]` +
      `P1 -> R0 [label=" 9"]\n P0 -> K1 [label=" 6"]\n\n             { rank=same; P0,P1 }\n { rank=same; K0,K1,R0 }\n\n            }\n        `,
  },
};

const mutations = {
  SET_PROPERTY(state: IState, payload: { path: string; value: any }) {
    const { path, value } = payload;
    const splitPath = path.split("__");

    const parsedPath = splitPath.reduce((parsedPath, substring) => {
      return `${parsedPath}["${substring}"]`;
    }, "");
    const setState = new Function("state", "value", `state${parsedPath} = value;`);
    setState(state, value);
  },
};
const actions = {
  fetchTaskData: async ({ commit }, payloadObject: { [key: string]: any }) => {
    const { endpoint, payload } = payloadObject;
    const result = await axios.post(`/api/${endpoint}`, payload);
    commit("SET_PROPERTY", { path: "taskData", value: JSON.parse(result.data) });
  },
  fetchTaskGraph: async ({ commit }, payload: { task: string }) => {
    try {
      const result = await axios.post("/api/fetchTaskGraph", payload);
      const { UI } = JSON.parse(result.data);
      const { topology, edges, nodes, rootNode } = UI;
      commit("SET_PROPERTY", { path: "topology", value: new Matrix(...topology) });
      commit("SET_PROPERTY", { path: "edges", value: edges });
      commit("SET_PROPERTY", { path: "nodes", value: nodes });
      commit("SET_PROPERTY", { path: "rootNode", value: rootNode });
      commit("SET_PROPERTY", { path: "currentNode", value: rootNode });
    } catch (error) {
      console.log(error);
    }
  },
  setPropertyFromPath: async ({ commit }, payload: { path: string; value: any }) => {
    commit("SET_PROPERTY", payload);
  },
};
const getters = {
  getPropertyFromPath: (state: IState) => (path: string) => {
    const splitPath = path.split("__");
    return splitPath.reduce((value, key) => {
      if (value && Object.keys(value).includes(key)) return value[key];
      else return null;
    }, state);
  },
};

export const configurationStore = createStore<IState>({
  state,
  mutations,
  actions,
  getters,
  plugins: [createLogger()],
});
