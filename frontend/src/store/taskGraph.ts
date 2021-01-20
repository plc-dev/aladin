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
  rootNode: 0,
  previousNode: ref(0),
  topology: new Matrix([0, null, null], [1, 2, null], [3, 4, null], [5, 6, null], [7, 8, null], [9, null, null]),
  edges: reactive({
    0: [1, 1],
    1: [2],
    2: [3, 4, 5],
    3: [6],
    4: [9],
    5: [7, 8],
    6: [9],
    7: [9],
    8: [9],
    9: [],
  }),
  currentNode: 0,
  nodes: reactive({
    0: {
      pathDescriptions: {
        1: {
          title: "Vorwärts",
          image: "/img/tasks/gozintograph/Basch_Gozmatr2.png",
          description: "Generiere einen Gozintographen und führe eine Stücklistenauflösung anhand verschiedener Algorithmen durch.",
        },
        2: {
          title: "Rückwärts",
          image: "/img/tasks/gozintograph/Basch_Gozmatr2.png",
          description: "Generiere einen Primärbedarfsvektor und rechne zurück.",
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
          { x: 18, y: 15, w: 2, h: 2, i: 0, static: false },
          { x: 16, y: 15, w: 2, h: 2, i: 1, static: false },
        ],
      },
      components: {
        0: {
          type: "DOTGraph",
          name: "Gozintograph",
          dimensions: { width: 500, height: 500 },
          isValid: true,
          dependency: "taskData__dotDescription",
          component: {},
        },
        1: {
          type: "TaskConfiguration",
          name: "Konfiguration",
          dimensions: { width: 200, height: 200 },
          isValid: false,
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
                  upperValue: 4,
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
                  lowerValue: 1,
                  upperValue: 10,
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
                  upperValue: 4,
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
                  lowerValue: 0,
                  upperValue: 10,
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
                  lowerValue: 0.2,
                  upperValue: 0.2,
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
      },
    },
    2: {
      pathDescriptions: {
        3: { title: "Vazsonyi-Verfahren", image: "/img/tasks/gozintograph/Basch_Gozmatr2.png", description: "Hier sehen Sie was" },
        4: { title: "Vazsonyi", image: "/img/tasks/gozintograph/Basch_Gozmatr2.png", description: "Hier sehen Sie nichts" },
        5: { title: "Vazsonyi", image: "/img/tasks/gozintograph/Basch_Gozmatr2.png", description: "Überraschung" },
      },
    },
    3: {
      layouts: {
        sm: [{ x: 12, y: 5, w: 2, h: 5, i: 2, static: false }],
        md: [{ x: 0, y: 10, w: 2, h: 5, i: 2, static: false }],
        lg: [
          { x: 18, y: 15, w: 2, h: 2, i: 2, static: false },
          { x: 20, y: 15, w: 2, h: 2, i: 3, static: false },
        ],
      },
      components: {
        2: {
          name: "Direktbedarfsmatrix",
          type: "MatrixComponent",
          dimensions: { width: 200, height: 200 },
          isValid: false,
          dependency: "taskData__adjacencyMatrix",
          methods: { fillZeros: "Ergänze Nullen", showSolution: "Zeige Lösung", copyToClipboard: "Kopieren" },
          component: {
            initialize: {
              validation: {
                operations: [],
                matrix1Path: "taskData__adjacencyMatrix",
              },
              user: {
                operations: [{ name: "getValueInitializedMatrix", args: [null] }],
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
        3: {
          type: "DOTGraph",
          name: "Gozintograph",
          dimensions: { width: 500, height: 500 },
          isValid: true,
          dependency: "taskData__dotDescription",
          component: {},
        },
      },
    },
    4: {
      layouts: {
        sm: [{ x: 12, y: 5, w: 2, h: 5, i: 2, static: false }],
        md: [{ x: 0, y: 10, w: 2, h: 5, i: 2, static: false }],
        lg: [
          { x: 18, y: 15, w: 2, h: 2, i: 2, static: false },
          { x: 20, y: 15, w: 2, h: 2, i: 3, static: false },
        ],
      },
      components: {
        2: {
          name: "Direktbedarfsmatrix",
          type: "MatrixComponent",
          dimensions: { width: 200, height: 200 },
          isValid: false,
          dependency: "taskData__adjacencyMatrix",
          methods: { fillZeros: "Ergänze Nullen", showSolution: "Zeige Lösung", copyToClipboard: "Kopieren" },
          component: {
            initialize: {
              validation: {
                operations: [],
                matrix1Path: "taskData__adjacencyMatrix",
              },
              user: {
                operations: [{ name: "getValueInitializedMatrix", args: [null] }],
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
        3: {
          type: "DOTGraph",
          name: "Gozintograph",
          dimensions: { width: 500, height: 500 },
          isValid: true,
          dependency: "taskData__dotDescription",
          component: {},
        },
      },
    },
    5: {
      layouts: {
        sm: [{ x: 12, y: 5, w: 2, h: 5, i: 2, static: false }],
        md: [{ x: 0, y: 10, w: 2, h: 5, i: 2, static: false }],
        lg: [
          { x: 18, y: 15, w: 2, h: 2, i: 2, static: false },
          { x: 20, y: 15, w: 2, h: 2, i: 3, static: false },
        ],
      },
      components: {
        2: {
          name: "Direktbedarfsmatrix",
          type: "MatrixComponent",
          dimensions: { width: 200, height: 200 },
          isValid: false,
          dependency: "taskData__adjacencyMatrix",
          methods: { fillZeros: "Ergänze Nullen", showSolution: "Zeige Lösung", copyToClipboard: "Kopieren" },
          component: {
            initialize: {
              validation: {
                operations: [],
                matrix1Path: "taskData__adjacencyMatrix",
              },
              user: {
                operations: [{ name: "getValueInitializedMatrix", args: [null] }],
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
        3: {
          type: "DOTGraph",
          name: "Gozintograph",
          dimensions: { width: 500, height: 500 },
          isValid: true,
          dependency: "taskData__dotDescription",
          component: {},
        },
      },
    },
  }),
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
    return splitPath.reduce((value, key) => {
      if (value && Object.keys(value).includes(key)) return value[key];
      else return null;
    }, state);
  },
};

export const store = createStore<IState>({
  state,
  mutations,
  actions,
  getters,
  plugins: [createLogger()],
});
