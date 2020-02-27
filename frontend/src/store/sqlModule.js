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
    queryList: [],
    currentTab: "",
    generated: {}
  },
  getters: {
    getFormatedResult: state => ({ index, type }) => {
      const userResult =
        type === "existing"
          ? state.queryList[index].userResult
          : state.generated[state.selectedDB.dbName][index].userResult;
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
    SET_QUERY_LIST(state, queries) {
      state.queryList = queries;
    },
    SET_GENERATED_LIST(state, { query, question }) {
      const selectedDB = state.selectedDB.dbName;
      if (!state.generated[selectedDB])
        state.generated[selectedDB] = Vue.set(state.generated, selectedDB, []);
      state.generated[selectedDB] = [
        ...state.generated[selectedDB],
        {
          query,
          question: question || "test",
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
      if (type === "generated") {
        const selectedDB = state.selectedDB.dbName;
        state.generated[selectedDB][index].userResult = userResult;
        state.generated[selectedDB][index].result = result;
      } else {
        state.queryList[index].userResult = userResult;
        state.queryList[index].result = result;
      }
    },
    SET_USER_QUERY_LIST(state, { userQuery, index }) {
      state.queryList[index].userQuery = userQuery;
    },
    SET_USER_QUERY_GENERATED(state, { userQuery, index }) {
      const selectedDB = state.selectedDB.dbName;
      state.generated[selectedDB][index].userQuery = userQuery;
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
    async getQueryList({ commit, state }) {
      try {
        const response = await axios.get(
          `/api/getDBQuestions?dbName=${state.selectedDB.dbName}`
        );
        commit("SET_QUERY_LIST", response.data);
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
    }
  }
};
