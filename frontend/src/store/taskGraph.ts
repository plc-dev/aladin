import { createStore, createLogger } from "vuex";
import { reactive, ref } from "vue";
import { Matrix } from "../helpers/LinearAlgebra";
import axios from "axios";
import { IState } from "@/interfaces/TaskGraphInterface";

const state: IState = {
  taskReplay: { stateChange: [] },
  zoomScale: ref(1),
  currentTask: "gozintograph",
  taskData: reactive({}),
  topology: new Matrix([0, null, null], [1, null, null], [2, 3, null], [5, 6, 4], [7, 8, null], [9, null, null]),
  edges: reactive([
    { id: 0, next: [1] },
    { id: 1, next: [2, 3, 4] },
    { id: 2, next: [5] },
    { id: 3, next: [6] },
    { id: 4, next: [9] },
    { id: 5, next: [7, 8] },
    { id: 6, next: [8] },
    { id: 7, next: [9] },
    { id: 8, next: [9] },
    { id: 9, next: [] },
  ]),
  nodes: reactive({
    0: {
      layouts: {
        sm: [
          { x: 12, y: 5, w: 3, h: 4, i: 0, static: false },
          { x: 10, y: 5, w: 2, h: 3, i: 1, static: false },
          { x: 12, y: 5, w: 2, h: 5, i: 2, static: false },
        ],
        md: [
          { x: 0, y: 0, w: 5, h: 6, i: 0, static: false },
          { x: 0, y: 5, w: 2, h: 3, i: 1, static: false },
          { x: 0, y: 10, w: 2, h: 5, i: 2, static: false },
        ],
        lg: [
          { x: 12, y: 7, w: 2, h: 2, i: 0, static: false },
          { x: 10, y: 7, w: 2, h: 2, i: 1, static: false },
        ],
      },
      components: {
        0: {
          type: "DOTGraph",
          name: "Gozintograph",
          dimensions: { width: 500, height: 500 },
          component: {
            dotDescription: `digraph {
            node [shape="circle" style="filled"]
            edge [dir="back"]
            B3 -> K3 [label=" 50"]
            B4 -> K4 [label=" 48"]
            B1 -> R2 [label=" 44"]
            B2 -> B4 [label=" 40"]
            B1 -> R0 [label=" 27"]
            B0 -> B3 [label=" 22"]
            B0 -> K2 [label=" 14"]
            B2 -> R1 [label=" 24"]
            B0 -> K1 [label=" 47"]
            B0 -> B1 [label=" 13"]
            B0 -> B2 [label=" 25"]
            P3 -> K0 [label=" 14"]
            P3 -> B0 [label=" 22"]
            P0 -> B4 [label=" 42"]
            P1 -> K2 [label=" 31"]
            P2 -> K4 [label=" 29"]
            { rank=same; P0,P1,P2,P3 }
            { rank=same; K0,B0 }
            { rank=same; K1,B1,B2 }
            { rank=same; R0,R1,B3,K2 }
            { rank=same; R2,B4 }
            { rank=same; K3,K4 }
        }`,
          },
        },
        1: {
          type: "TaskConfiguration",
          name: "Konfiguration",
          dimensions: { width: 200, height: 200 },
          component: {
            actions: {
              instruction: "generateGraph",
              type: "stuff",
              label: "stuff",
            },
            state: {
              depth: {
                type: "number",
                initial: {
                  lowerValue: 2,
                  upperValue: 2,
                },
                min: 0,
                max: 200,
                presets: {
                  easy: 2,
                  medium: 3,
                  hard: 5,
                },
              },
              weight: {
                type: "number",
                bounds: { min: 0, max: 200 },
                initial: {
                  lowerValue: 2,
                  upperValue: 2,
                },
                presets: {
                  easy: [2, 10],
                  medium: 3,
                  hard: 5,
                },
              },
              width: {
                type: "number",
                min: 0,
                max: 200,
                initial: {
                  lowerValue: 2,
                  upperValue: 2,
                },
                presets: {
                  easy: 2,
                  medium: 3,
                  hard: 5,
                },
              },
              value: {
                type: "number",
                min: 0,
                max: 200,
                initial: {
                  lowerValue: 2,
                  upperValue: 2,
                },
                presets: {
                  easy: 2,
                  medium: 3,
                  hard: 5,
                },
              },
              edgeDensity: {
                type: "number",
                min: 0,
                max: 1,
                initial: {
                  lowerValue: 0,
                  upperValue: 1,
                },
                presets: {
                  easy: 2,
                  medium: 3,
                  hard: 5,
                },
              },
            },
          },
        },
        2: {
          name: "Direktbedarfsmatrix",
          type: "MatrixComponent",
          dimensions: { width: 200, height: 200 },
          component: {
            initialize: {
              operation: "getRows",
              matrix1Path: "taskData__adjacencyMatrix",
            },
            initialData: [
              [null, null, null],
              [null, null, null],
            ],
            validationData: [],
            isLocked: false,
          },
        },
      },
    },
    1: {
      layouts: {
        sm: [
          { x: 12, y: 5, w: 3, h: 4, i: 0, static: false },
          { x: 10, y: 5, w: 2, h: 3, i: 1, static: false },
          { x: 12, y: 5, w: 2, h: 5, i: 2, static: false },
        ],
        md: [
          { x: 0, y: 0, w: 5, h: 6, i: 0, static: false },
          { x: 0, y: 5, w: 2, h: 3, i: 1, static: false },
          { x: 0, y: 10, w: 2, h: 5, i: 2, static: false },
        ],
        lg: [
          { x: 12, y: 7, w: 2, h: 2, i: 0, static: false },
          { x: 10, y: 7, w: 2, h: 2, i: 1, static: false },
          { x: 12, y: 9, w: 2, h: 2, i: 2, static: false },
        ],
      },
      components: {
        2: {
          name: "Direktbedarfsmatrix",
          type: "MatrixComponent",
          dimensions: { width: 200, height: 200 },
          component: {
            initialData: [
              [null, null, null],
              [null, null, null],
            ],
            validationData: [],
            isLocked: false,
          },
        },
      },
    },
  }),
  currentNode: 0,
  canProgress: ref(true),
};
const mutations = {
  SET_PROPERTY(state: IState, payload: { path: string; value: any }) {
    const { path, value } = payload;
    const splitPath = path.split("__");
    // save state on every mutation as a side effect for task replay
    state.taskReplay.stateChange.push({ timestamp: new Date().getTime(), ...payload });

    const parsedPath = splitPath.reduce((parsedPath, substring) => {
      return `${parsedPath}["${substring}"]`;
    }, "");
    console.log(`state${parsedPath}`);
    const setState = new Function("state", "value", `state${parsedPath} = value; console.log(value);`);
    setState(state, value);
  },
};
const actions = {
  fetchTaskData: async ({ commit }, payloadObject: { [key: string]: any }) => {
    const { endpoint, payload } = payloadObject;
    const result = await axios.post(`/api/${endpoint}`, payload);
    commit("SET_PROPERTY", { path: "taskData", value: JSON.parse(result.data) });
  },
  fetchTaskGraph: async ({ commit }, payload: { [key: string]: [string] }) => {
    try {
      const result = { data: { topology: [], edges: "", nodes: "" } }; // await axios.post("/api/queryDB", { dbName: "aladin", instruction: "taskGraph", parameters: payload });
      const { topology, edges, nodes } = result.data;
      // commit("SET_PROPERTY", { path: "topology", value: new Matrix(...topology) });
      // commit("SET_PROPERTY", { path: "edges", value: edges });
      // commit("SET_PROPERTY", { path: "nodes", value: nodes });
    } catch (error) {
      console.log(error);
    }
  },
  setPropertyFromPath: ({ commit }, payload: { path: string; value: any }) => {
    commit("SET_PROPERTY", payload);
  },
};
const getters = {
  getPropertyFromPath: (state: IState) => (path: string) => {
    const splitPath = path.split("__");
    return splitPath.reduce((value, key) => value[key], state);
  },
};

export const store = createStore<IState>({
  state,
  mutations,
  actions,
  getters,
  plugins: [createLogger()],
});
