import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: require("@/store/userModule").default,
    gozintograph: require("@/store/gozintographModule").default
  }
});
