import axios from "axios";
import router from "../router";
import { deserializeLocalStorage } from "@/lib/helper";

export default {
  namespaced: true,

  state: {
    publicVapidKey:
      "BHaC5UbbkQBKz6v-I-JQ2abGaTZYfvO6j1CtPQYIBqJJeXdNcETen-BMP0rqZTscCkjPtJDFwqFYwdPPGtX5Tzo",
    settings: {
      language:
        deserializeLocalStorage(localStorage.language) ||
        navigator.language ||
        "en",
      texts: deserializeLocalStorage(localStorage.texts) || {}
    },
    uuid: "",
    token: "",
    loginError: false,
    registerError: false,
    languageError: false,
    presenterMode: false
  },
  getters: {
    getTexts(state) {
      return state.texts;
    }
  },
  mutations: {
    SET_TEXTS(state, texts) {
      state.texts = { ...texts };
    },
    SET_USER_SETTINGS(state, data) {
      const dataKeys = Object.keys(data);
      if (dataKeys.includes("token")) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("uuid", data.uuid);
      }
      dataKeys.forEach(key => (state[key] = data[key]));
    },
    REMOVE_USER_CREDENTIALS(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("uuid");
      state.token = "";
      state.uuid = "";
    },
    SET_API_ERROR(state, error) {
      const errorType = Object.keys(error)[0];
      state[errorType] = error[errorType];
    },
    TOGGLE_PRESENTER_MODE(state) {
      state.presenterMode = !state.presenterMode;
    }
  },
  actions: {
    async authenticate({ commit }) {
      try {
        const token = localStorage.token;
        if (token === undefined) {
          commit("REMOVE_USER_CREDENTIALS");
          return;
        }
        const response = await axios.get("api/authenticate", {
          headers: { Authorization: `Bearer ${token}` },
          params: { uuid: localStorage.uuid }
        });
        commit("SET_USER_SETTINGS", {
          token: response.data.token,
          uuid: response.data.uuid
        });
      } catch (error) {
        commit("REMOVE_USER_CREDENTIALS");
      }
    },
    async login({ commit }, { email, password }) {
      try {
        const userSettings = await axios.post("api/login", {
          email,
          password
        });
        commit("SET_USER_SETTINGS", userSettings.data);
        if (history.length < 2) {
          router.push("/");
        } else {
          router.go(-1);
        }
      } catch (error) {
        commit("SET_API_ERROR", { loginError: true });
      }
    },
    async register({ commit }, { email, password }) {
      try {
        const userSettings = await axios.post("api/register", {
          email,
          password
        });
        commit("SET_USER_SETTINGS", userSettings.data);
        if (history.length < 2) {
          router.push("/");
        } else {
          router.go(-1);
        }
      } catch (error) {
        commit("SET_API_ERROR", { registerError: true });
      }
    },
    async getLanguage({ commit, state }) {
      try {
        const language = state.language || navigator.language;
        const response = await axios.post("/api/language", {
          countryCode: language
        });
        const texts = response.data;
        commit("SET_TEXTS", texts);
        localStorage.texts = JSON.stringify(texts);
      } catch (error) {
        commit("SET_API_ERROR", { languageError: true });
      }
    },
    logout({ commit }) {
      commit("REMOVE_USER_CREDENTIALS");
    }
  }
};
