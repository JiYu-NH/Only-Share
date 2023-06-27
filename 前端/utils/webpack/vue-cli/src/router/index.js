import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: () => import('@/views/Home'),
    },
    {
        path: '/about',
        component: () => import('@/views/About'),
    },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
