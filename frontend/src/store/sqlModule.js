import axios from "axios";

export default {
  namespaced: true,

  state: {
    dbList: [],
    selectedDB: {
      dbName: "",
      index: null
    },
    queryList: [],
    currentTab: ""
  },
  getters: {
    getFormatedResult: state => index => {
      const userResult = state.queryList[index].userResult;
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
    SET_CURRENT_TAB(state, tab) {
      state.currentTab = tab;
    },
    SET_QUERY_RESULT(state, { index, userResult, result }) {
      state.queryList[index].userResult = userResult;
      state.queryList[index].result = result;
    },
    SET_USER_QUERY(state, { userQuery, index }) {
      state.queryList[index].userQuery = userQuery;
    }
  },
  actions: {
    async getDBList({ commit }) {
      try {
        const response = await axios.get("/api/getDBList");
        commit("SET_DB_LIST", response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async getQueryList({ commit, state }) {
      try {
        const response = await axios.get(
          `/api/getDBQuestions?dbName=${state.selectedDB.dbName}`
        );
        commit("SET_QUERY_LIST", response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async submitQuery({ commit }, payload) {
      try {
        const response = await axios.post("/api/submitQuery", payload);
        commit("SET_QUERY_RESULT", response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
