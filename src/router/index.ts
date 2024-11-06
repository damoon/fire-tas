import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MoneyValueOptimizer from "@/components/MoneyValueOptimizer.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: MoneyValueOptimizer,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
