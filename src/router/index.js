import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/screens/LandingPage.vue'; // Assuming this is your landing page
import Dashboard from '@/screens/Dashboard.vue';
import Profile from '@/screens/Profile.vue'; // Import the Profile component
import Users from '@/screens/Users.vue';
import { projectAuth } from '@/firebase/config';

// Route guard to check authentication status
const requireAuth = (to, from, next) => {
    let user = projectAuth.currentUser;
    // console.log('current user in auth guard: ', user);
    if (!user) {
        next({ name: 'LandingPage' });
    } else {
        next();
    }
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'LandingPage',
            component: LandingPage
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            beforeEnter: requireAuth // Protect the Dashboard route
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            beforeEnter: requireAuth
        },
        {
            path: '/users',
            name: 'Users',
            component: Users,
            beforeEnter: requireAuth
        },
    ]
});

export default router;
