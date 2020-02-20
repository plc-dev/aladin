import Vue from "vue/dist/vue.js";
import App from "./App.vue";
import VueAlertify from "vue-alertify";
import VTooltip from "v-tooltip";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(VueAlertify);
Vue.use(VTooltip);

require("@/css/main.css");
require("@/css/tooltip.css");
store.dispatch("user/authenticate");
store.dispatch("user/getLanguage");

router.beforeEach((to, from, next) => {
  if (to.meta.loggedIn === true) {
    if (localStorage.token) {
      next();
    } else {
      next("/login");
    }
  } else if (to.meta.loggedIn === false) {
    if (!localStorage.token) {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
