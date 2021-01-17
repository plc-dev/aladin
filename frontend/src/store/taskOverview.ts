import { createStore } from "vuex";
import { reactive } from "vue";
import axios from "axios";

const state: IState = {
  taskList: reactive([{ name: "Gozintograph" }, { name: "SQL" }, { name: "GeoInterpolation" }]),
};
const mutations = {};
const actions = {
  async fetchTasks({ commit }) {
    const response = await axios.get("/api/taskList");
    commit("SET_TASK_LIST", response.data);
  },
};
const getters = {};

export const store = createStore<IState>({
  state,
  mutations,
  actions,
  getters,
});

interface ITask {
  name: string;
}

interface IState {
  taskList: Array<ITask>;
}
