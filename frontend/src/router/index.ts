import { createRouter, createWebHistory } from "vue-router";
import TaskOverview from "@/views/TaskOverview.vue";

const routes = [
  {
    path: "/",
    name: "TaskOverview",
    component: TaskOverview,
  },
  {
    path: "/task/:task",
    name: "Task",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "task" */ "@/views/Task.vue"),
  },
  {
    path: "/grid",
    name: "Grid",
    component: () => import(/* webpackChunkName: "grid" */ "@/views/VueGrid.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import(/* webpackChunkName: "settings" */ "@/views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
