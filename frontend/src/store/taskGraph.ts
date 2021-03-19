import { createStore, createLogger } from "vuex";
import { Matrix } from "../helpers/LinearAlgebra";
import axios, { AxiosResponse } from "axios";
import { IState } from "@/interfaces/TaskGraphInterface";

const state: IState = {
  currentTask: null,
  layoutSize: "lg",
  currentNode: null,
  previousNode: null,
  rootNode: null,
  topology: new Matrix([]),
  edges: {},
  nodes: {},
  taskData: {},
};
const mutations = {
  SET_PROPERTY(state: IState, payload: { path: string; value: any }) {
    const { path, value } = payload;
    const splitPath = path.split("__");
    // save state on every mutation as a side effect for task replay if not in replay or editor mode
    // if (!editor && !replay)
    // state.taskReplay.stateChange.push({ timestamp: new Date().getTime(), ...payload });

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

export const taskStore = createStore<IState>({
  state,
  mutations,
  actions,
  getters,
  plugins: [createLogger()],
});
