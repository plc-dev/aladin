import axios from "axios";
import Vue from "vue/dist/vue.js";

export default {
  namespaced: true,

  state: {
    dbList: [],
    selectedDB: {
      dbName: "",
      index: null
    },
    existingQueryList: [],
    proposedQueryList: [],
    currentTab: "",
    generatedQueryList: {}
  },
  getters: {
    getFormatedResult: state => ({ index, type }) => {
      const userResult =
        type === "generated"
          ? state[`${type}QueryList`][state.selectedDB.dbName][index].userResult
          : state[`${type}QueryList`][index].userResult;
      if (typeof userResult !== "object") return userResult;
      return userResult
        .reduce((table, dataRow, index) => {
          if (!index) {
            table += "<tr>";
            Object.keys(dataRow).forEach(dataColumn => {
              table += `<th>${dataColumn}</th>`;
            });
            table += "</tr>";
          }
          table += "<tr>";
          Object.keys(dataRow).forEach(dataColumn => {
            table += `<td>${dataRow[dataColumn]}</td>`;
          });
          table += "</tr>";
          return table;
        }, '<table border="1">')
        .concat("</tr>");
    }
  },
  mutations: {
    SET_DB_LIST(state, dbList) {
      state.dbList = dbList;
    },
    SET_DB(state, db) {
      state.selectedDB = db;
    },
    SET_QUERY_LISTS(state, queryLists) {
      Object.keys(queryLists).forEach(
        type => (state[`${type}QueryList`] = queryLists[type])
      );
    },
    SET_GENERATED_LIST(state, { query, question }) {
      const selectedDB = state.selectedDB.dbName;
      if (!state.generatedQueryList[selectedDB])
        state.generatedQueryList[selectedDB] = Vue.set(
          state.generatedQueryList,
          selectedDB,
          []
        );
      state.generatedQueryList[selectedDB] = [
        ...state.generatedQueryList[selectedDB],
        {
          query,
          question: question,
          userQuery: "",
          userResult: "",
          result: ""
        }
      ];
    },
    SET_CURRENT_TAB(state, tab) {
      state.currentTab = tab;
    },
    SET_QUERY_RESULT(state, { index, userResult, result, type }) {
      const selectedDB = state.selectedDB.dbName;
      state[`${type}QueryList`][selectedDB][index].userResult = userResult;
      state[`${type}QueryList`][selectedDB][index].result = result;
    },
    SET_USER_QUERY_LIST(state, { userQuery, index, type }) {
      state[`${type}QueryList`][index].userQuery = userQuery;
    },
    SET_USER_QUERY_GENERATED(state, { userQuery, index }) {
      const selectedDB = state.selectedDB.dbName;
      state.generatedQueryList[selectedDB][index].userQuery = userQuery;
    },
    SET_PROPOSED_LIST(state, queryObject) {
      const selectedDB = state.selectedDB.dbName;
      state.proposed[selectedDB] = [...state.proposed[selectedDB], queryObject];
    }
  },
  actions: {
    async getDBList({ commit }) {
      try {
        const response = await axios.get("/api/getDBList");
        commit("SET_DB_LIST", response.data);
      } catch (error) {
        //console.error(error);
      }
    },
    async getQueryLists({ commit, state }) {
      try {
        const response = await axios.get(
          `/api/getDBQuestions?dbName=${state.selectedDB.dbName}`
        );
        commit("SET_QUERY_LISTS", response.data);
      } catch (error) {
        //console.error(error);
      }
    },
    async generateQuery({ commit, state }) {
      try {
        const payload = { dbName: state.selectedDB.dbName };
        const response = await axios.post("/api/generateQuery", payload);

        commit("SET_GENERATED_LIST", response.data);
      } catch (error) {
        //console.error(error);
      }
    },
    async submitQuery({ commit }, payload) {
      try {
        const response = await axios.post("/api/submitQuery", payload);
        commit("SET_QUERY_RESULT", response.data);
      } catch (error) {
        //console.error(error);
      }
    },
    async proposeQuery({ state, commit }, payload) {
      try {
        const selectedDB = state.selectedDB.dbName;

        payload = { ...payload, id: selectedDB };
        const response = await axios.post("/api/proposeQuery", payload);
        commit("SET_PROPOSED_LIST", response.data);
      } catch (error) {
        // console.error(error);
      }
    }
  }
};
