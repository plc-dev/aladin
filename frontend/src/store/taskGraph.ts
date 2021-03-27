import { createStore, createLogger } from "vuex";
import axios from "axios";
import { IState } from "@/interfaces/TaskGraphInterface";

const state: IState = {
  currentTask: null,
  layoutSize: "lg",
  currentNode: null,
  previousNode: null,
  rootNode: null,
  topology: [],
  edges: {},
  nodes: {},
  taskData: {},
  taskReplay: { steps: [], mouse: [], panning: [], zooming: [] },
  restoredFromReplay: false,
};
const mutations = {
  SET_PROPERTY(state: IState, payload: { path: string; value: any }) {
    const { path, value } = payload;
    const splitPath = path.split("__");
    // save state on every mutation as a side effect for task replay
    state.taskReplay.steps.push({ timestamp: new Date().getTime(), ...payload });

    const parsedPath = splitPath.reduce((parsedPath, substring) => {
      return `${parsedPath}["${substring}"]`;
    }, "");
    const setState = new Function("state", "value", `state${parsedPath} = value;`);
    setState(state, value);
  },
  TRACK_MOUSE(state: IState, payload: { timestamp: string; x: number; y: number }) {
    state.taskReplay.mouse.push(payload);
  },
  TRACK_PANNING(state: IState, payload: { timestamp: string; x: number; y: number }) {
    state.taskReplay.panning.push(payload);
  },
  TRACK_ZOOMING(state: IState, payload: { timestamp: string; scale: number }) {
    state.taskReplay.zooming.push(payload);
  },
  RESTORED_FROM_REPLAY(state: IState) {
    state.restoredFromReplay = true;
  },
};
const actions = {
  trackMouse: async ({ commit }, payload) => {
    commit("TRACK_MOUSE", payload);
  },
  trackPanning: async ({ commit }, payload) => {
    commit("TRACK_PANNING", payload);
  },
  trackZooming: async ({ commit }, payload) => {
    commit("TRACK_ZOOMING", payload);
  },
  storeReplay: async () => {
    const hash = await axios.post("/api/storeReplay", { replay: JSON.stringify(state.taskReplay) });
    console.log(hash);
  },
  restoredFromReplay: async ({ commit }) => {
    commit("RESTORED_FROM_REPLAY");
  },
  fetchTaskData: async ({ commit }, payloadObject: { [key: string]: any }) => {
    const { endpoint, payload } = payloadObject;
    // TODO extract language to seperate user module
    const result = await axios.post(`/api/${endpoint}`, { ...payload, language: "de" });
    Object.entries(JSON.parse(result.data)).forEach(([key, value]) => {
      commit("SET_PROPERTY", { path: `taskData__${key}`, value: value });
    });
  },
  fetchTaskGraph: async ({ commit }, payload: { task: string }) => {
    try {
      const result = await axios.post("/api/fetchTaskGraph", payload);
      const { UI } = JSON.parse(result.data);
      const { topology, edges, nodes, rootNode } = UI;
      commit("SET_PROPERTY", { path: "topology", value: topology });
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

export const taskStore = createStore<IState>({
  state,
  mutations,
  actions,
  getters,
  plugins: [createLogger()],
});
