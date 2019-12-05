import axios from "axios";
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
    }
  },
  getters: {
    getTexts(state) {
      return state.texts;
    }
  },
  mutations: {
    SET_TEXTS(state, texts) {
      state.texts = { ...texts };
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
    }
  }
};
