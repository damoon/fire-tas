import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import FireTas from "@/components/FireTas.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: FireTas,
	},
];

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
