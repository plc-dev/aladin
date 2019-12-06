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
    id: "",
    loggedIn: false
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
    SET_USER_SETTINGS(state, settings) {
      state.id = settings.uuid;
      state.loggedIn = true;
      console.warn(state.loggedIn);
    }
  },
  actions: {
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
        // TODO offline usage
      }
    },
    async login({ commit }, { email, password }) {
      try {
        const userSettings = await axios.post("api/login", {
          email,
          password
        });
        commit("SET_USER_SETTINGS", userSettings.data);
        router.push("/");
      } catch (error) {
        // LOGIN ERROR
      }
    },
    async register({ commit }, { email, password }) {
      try {
        const userSettings = await axios.post("api/register", {
          email,
          password
        });
        commit("SET_USER_SETTINGS", userSettings);
        router.push("/");
      } catch (error) {
        // LOGIN ERROR
      }
    }
  }
};
