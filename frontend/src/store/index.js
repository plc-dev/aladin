import Vue from "vue/dist/vue.js";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: require("@/store/userModule").default,
    gozintograph: require("@/store/gozintographModule").default,
    sql: require("@/store/sqlModule").default,
    interpolation: require("@/store/interpolationModule").default,
  }
});
