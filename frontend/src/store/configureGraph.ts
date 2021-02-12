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
          {
            x: 16,
            y: 15,
            w: 2,
            h: 2,
            i: 1,
            static: false,
          },
        ],
      },
      components: {
        "1": {
          name: "Traversal",
          type: "VisualGraphTraversal",
          isValid: true,
          dependencies: { DOTGraph: "taskData__dotDescription", VisualGraphTraversal: "taskData__nodes" },
          component: {},
        },
        "3": {
          type: "PathDisplay",
          name: "display",
          isValid: false,
          dependencies: { PathDisplay: "taskData__dotDescription" },
          component: {},
        },
      },
    },
  },
  taskData: {
    nodes: {
      "0": { id: 0, isLeaf: false, label: "P0", value: 6 },
      "1": { id: 1, isLeaf: false, label: "P1", value: 9 },
      "2": { id: 2, isLeaf: false, label: "P2", value: 8 },
      "3": { id: 3, isLeaf: false, label: "B0", value: 8 },
      "4": { id: 4, isLeaf: false, label: "B1", value: 10 },
      "5": { id: 5, isLeaf: false, label: "B2", value: 1 },
      "6": { id: 6, isLeaf: true, label: "R0", value: 1 },
      "7": { id: 7, isLeaf: true, label: "R1", value: 3 },
      "8": { id: 8, isLeaf: true, label: "R2", value: 2 },
    },
    edges: [
      { between: [6, 4], weight: 7 },
      { between: [7, 0], weight: 5 },
      { between: [7, 3], weight: 7 },
      { between: [8, 1], weight: 10 },
      { between: [8, 5], weight: 8 },
      { between: [3, 2], weight: 2 },
      { between: [4, 0], weight: 6 },
      { between: [5, 0], weight: 9 },
    ],
    idGenerator: {},
    isDirected: true,
    topology: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ],
    paths: [
      [{ between: [7, 0], weight: 5 }],
      [
        { between: [4, 0], weight: 6 },
        { between: [6, 4], weight: 7 },
      ],
      [
        { between: [5, 0], weight: 9 },
        { between: [8, 5], weight: 8 },
      ],
      [{ between: [8, 1], weight: 10 }],
      [
        { between: [3, 2], weight: 2 },
        { between: [7, 3], weight: 7 },
      ],
    ],
    adjacencyMatrix: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 7, 0, 0, 0, 0],
      [5, 0, 0, 7, 0, 0, 0, 0, 0],
      [0, 10, 0, 0, 0, 8, 0, 0, 0],
    ],
    valueVector: [[6, 9, 8, 8, 10, 1, 1, 3, 2]],
    labelVector: ["P0", "P1", "P2", "B0", "B1", "B2", "R0", "R1", "R2"],
    dotDescription:
      '\n            digraph\n {\n            node [shape="circle" style="filled"]\n\n            edge [dir="back"]\n\n' +
      '             B1 -> R0 [label=" 7"]\n P0 -> R1 [label=" 5"]\n B0 -> R1 [label=" 7"]\n P1 -> R2 [label=" 10"]\n' +
      ' B2 -> R2 [label=" 8"]\n P2 -> B0 [label=" 2"]\n P0 -> B1 [label=" 6"]\n P0 -> B2 [label=" 9"]\n\n ' +
      "            { rank=same; P0,P1,P2 }\n { rank=same; B0,B1,B2 }\n { rank=same; R0,R1,R2 }\n\n            }\n        ",
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
