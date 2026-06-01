import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from "vue-router";
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css'
import { createPinia } from "pinia";
import ManagementPage from "./pages/ManagementPage.vue";
import BookingPage from "./pages/BookingPage.vue";

const routes = [
    { path: '/', component: ManagementPage },
    { path: '/booking', component: BookingPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.use(createPinia());

app.mount('#app');