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
    path: "/settings",
    name: "Settings",
    component: () => import(/* webpackChunkName: "settings" */ "@/views/Settings.vue"),
  },
  {
    path: "/editor",
    name: "Editor",
    component: () => import(/* webpackChunkName: "settings" */ "@/views/JSONEditor.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
