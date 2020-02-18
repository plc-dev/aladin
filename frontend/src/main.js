import Vue from "vue/dist/vue.js";
import App from "./App.vue";
import VueAlertify from "vue-alertify";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(VueAlertify);

require("@/css/main.css");
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
