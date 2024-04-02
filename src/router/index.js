import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/screens/LandingPage.vue' // Updated import
import Dashboard from '@/screens/Dashboard.vue'
import { projectAuth } from '@/firebase/config'

const requireAuth = (to, from, next) => {
    let user = projectAuth.currentUser
    console.log('current user in auth guard: ', user)
    if (!user) {
        next({ name: 'LandingPage' }) // Updated route name
    } else {
        next()
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'LandingPage', // Updated route name
            component: LandingPage // Updated component reference
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            beforeEnter: requireAuth
        }
    ]
})

export default router
