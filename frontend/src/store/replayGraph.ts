import { createStore, createLogger } from "vuex";
import { Matrix } from "../helpers/LinearAlgebra";
import axios from "axios";
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

export const replayStore = createStore<IState>({
  state,
  mutations,
  actions,
  getters,
  plugins: [createLogger()],
});
