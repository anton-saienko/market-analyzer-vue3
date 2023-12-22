import { createRouter, createWebHistory } from 'vue-router'
import SelectBusiness from '@/views/SelectBusiness.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: SelectBusiness
        },
    ]
})

export default router
