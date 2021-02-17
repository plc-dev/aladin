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
            i: 2,
            static: false,
          },
          {
            x: 20,
            y: 15,
            w: 2,
            h: 2,
            i: 3,
            static: false,
          },
          {
						x: 18,
						y: 17,
						w: 2,
						h: 2,
						i: 4,
						static: false,
          },
          {
						x: 20,
						y: 17,
						w: 2,
						h: 2,
						i: 5,
						static: false,
					}
        ],
      },
      components: {
        "2": {
          name: "Direktbedarfsmatrix",
          type: "MatrixComponent",
          dimensions: {
            width: 200,
            height: 200,
          },
          isValid: false,
          dependency: "taskData__adjacencyMatrix",
          methods: {
            fillZeros: "Ergänze Nullen",
            showSolution: "Zeige Lösung",
            copyToClipboard: "Kopieren",
          },
          component: {
            initialize: {
              validation: {
                operations: [],
                matrix1Path: "taskData__adjacencyMatrix",
              },
              user: {
                operations: [
                  {
                    name: "getValueInitializedMatrix",
                    args: [null],
                  },
                ],
                matrix1Path: "taskData__adjacencyMatrix",
              },
            },
            userData: null,
            validationData: null,
            readOnly: false,
            rowLabel: "taskData__labelVector",
            columnLabel: "taskData__labelVector",
          },
        },
        "3": {
          type: "DOTGraph",
          name: "Gozintograph",
          dimensions: {
            width: 500,
            height: 500,
          },
          isValid: true,
          dependency: "taskData__dotDescription",
          component: {},
        },
        "4": {
          type: "Textbox",
          name: "Textbox",
          dimensions: {
            width: 500,
            height: 500,
          },
          isValid: true,
          dependency: "taskData__sqlresult",
          component: {},
        },
        "5": {
          type: "Dropdown",
          name: "Dropdown",
          dimensions: {
            width: 500,
            height: 500,
          },
          isValid: true,
          dependency: "taskData__options",
          component: {
            selected: "northwind",
            header: "Wähle eine Datenbank aus.",
            label: "Datenbank"
          },
        },
      },
    },
  },
  taskData: {
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
    sqlResult: "blablabla",
    options: ["northwind", "architecture"],
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
