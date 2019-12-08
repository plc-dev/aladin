import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
    meta: { transitionName: "slide" }
  },
  {
    path: "/exercises",
    name: "exercises",
    component: () =>
      import(/* webpackChunkName: "exercises" */ "@/views/Exercises.vue"),
    meta: { transitionName: "slide" }
  },
  {
    path: "/exercise/:exerciseName",
    name: "exercise",
    component: () =>
      import(/* webpackChunkName: "exercise" */ "@/views/Exercise.vue"),
    meta: { transitionName: "slide" }
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
    meta: { transitionName: "slide", loggedIn: false }
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "@/views/Register.vue"),
    meta: { transitionName: "slide", loggedIn: false }
  },
  {
    path: "/settings",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "@/views/Settings.vue"),
    meta: { transitionName: "slide", loggedIn: true }
  },
  {
    path: "*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue"),
    meta: { transitionName: "slide" }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
