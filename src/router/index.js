import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/view/LandingPage.vue';
import Dashboard from '@/view/Dashboard.vue';
import Profile from '@/view/ProfileView.vue';
import Users from '@/view/ManageOfficerView.vue';
import Location from '@/view/LocationView.vue';
import AffectedArea from '@/view/AffectedAreaView.vue';
import Task from '@/view/ManageTaskView.vue';
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
            beforeEnter: requireAuth
        },
        {
            path: '/task',
            name: 'Task',
            component: Task,
            beforeEnter: requireAuth
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
        {
            path: '/location',
            name: 'Location',
            component: Location,
            beforeEnter: requireAuth
        },
        {
            path: '/AffectedArea',
            name: 'Affected Area',
            component: AffectedArea,
            beforeEnter: requireAuth
        },
    ]
});

export default router;
