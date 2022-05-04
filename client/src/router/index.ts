import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Login from '../pages/login.vue';
import Tasks from '../pages/tasks.vue';

const routes: RouteRecordRaw[] = [
	{ path: '/', component: Login },
	{ path: '/tasks', component: Tasks },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
