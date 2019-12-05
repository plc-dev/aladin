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
      import(/* webpackChunkName: "about" */ "@/views/Exercises.vue"),
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
