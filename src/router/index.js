import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/screens/LandingPage.vue'; // Assuming this is your landing page
import Dashboard from '@/screens/Dashboard.vue';
import Profile from '@/screens/Profile.vue'; // Import the Profile component
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
            path: '/profile', // Define the path for the profile page
            name: 'Profile', // Name the route
            component: Profile, // Set the component to be rendered
            beforeEnter: requireAuth // Protect the Profile route as well
        }
    ]
});

export default router;
