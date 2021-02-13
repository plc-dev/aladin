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
          dependencies: {
            DOTGraph: { dotDescription: "taskData__dotDescription" },
            VisualGraphTraversal: { nodes: "taskData__nodes", paths: "taskData__paths", dotDescription: "taskData__dotDescription" },
          },
          component: {
            selectedPaths: [],
            colorCoding: {
              standard: "black",
              completed: "green",
              selected: "red",
              partial: "blue",
            },
          },
        },
        "3": {
          type: "PathDisplay",
          name: "display",
          isValid: false,
          dependencies: { PathDisplay: { selectedPaths: "nodes__0__components__1__component__selectedPaths", nodes: "taskData__nodes" } },
          component: {},
        },
      },
    },
  },
  taskData: {
    nodes: {
      "0": { id: 0, isLeaf: false, label: "P0", value: 3 },
      "1": { id: 1, isLeaf: false, label: "P1", value: 1 },
      "2": { id: 2, isLeaf: false, label: "P2", value: 2 },
      "3": { id: 3, isLeaf: false, label: "B0", value: 6 },
      "4": { id: 4, isLeaf: false, label: "B1", value: 2 },
      "5": { id: 5, isLeaf: false, label: "B2", value: 7 },
      "6": { id: 6, isLeaf: true, label: "K0", value: 2 },
      "7": { id: 7, isLeaf: true, label: "K1", value: 2 },
      "8": { id: 8, isLeaf: true, label: "R0", value: 8 },
      "9": { id: 9, isLeaf: true, label: "R1", value: 4 },
    },
    edges: [
      { between: [6, 1], weight: 6 },
      { between: [6, 4], weight: 8 },
      { between: [7, 5], weight: 7 },
      { between: [8, 3], weight: 4 },
      { between: [9, 1], weight: 5 },
      { between: [9, 3], weight: 1 },
      { between: [9, 5], weight: 9 },
      { between: [3, 2], weight: 4 },
      { between: [4, 1], weight: 9 },
      { between: [5, 2], weight: 2 },
      { between: [8, 0], weight: 7 },
    ],
    idGenerator: {},
    isDirected: true,
    topology: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8, 9],
    ],
    paths: [
      [{ between: [8, 0], weight: 7 }],
      [{ between: [6, 1], weight: 6 }],
      [{ between: [9, 1], weight: 5 }],
      [
        { between: [4, 1], weight: 9 },
        { between: [6, 4], weight: 8 },
      ],
      [
        { between: [3, 2], weight: 4 },
        { between: [8, 3], weight: 4 },
      ],
      [
        { between: [3, 2], weight: 4 },
        { between: [9, 3], weight: 1 },
      ],
      [
        { between: [5, 2], weight: 2 },
        { between: [7, 5], weight: 7 },
      ],
      [
        { between: [5, 2], weight: 2 },
        { between: [9, 5], weight: 9 },
      ],
    ],
    adjacencyMatrix: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
      [0, 9, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 6, 0, 0, 8, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 7, 0, 0, 0, 0],
      [7, 0, 0, 4, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 0, 9, 0, 0, 0, 0],
    ],
    valueVector: [[3, 1, 2, 6, 2, 7, 2, 2, 8, 4]],
    labelVector: ["P0", "P1", "P2", "B0", "B1", "B2", "K0", "K1", "R0", "R1"],
    dotDescription:
      '\n            digraph\n {\n            node [shape="circle" style="filled"]\n\n            edge [dir="back"]\n\n' +
      '             P1 -> K0 [label=" 6"]\n B1 -> K0 [label=" 8"]\n B2 -> K1 [label=" 7"]\n B0 -> R0 [label=" 4"]\n' +
      ' P1 -> R1 [label=" 5"]\n B0 -> R1 [label=" 1"]\n B2 -> R1 [label=" 9"]\n P2 -> B0 [label=" 4"]\n P1 -> B1 [label=" 9"]\n' +
      ' P2 -> B2 [label=" 2"]\n P0 -> R0 [label=" 7"]\n\n             { rank=same; P0,P1,P2 }\n { rank=same; B0,B1,B2 }\n' +
      " { rank=same; K0,K1,R0,R1 }\n\n            }\n        ",
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
