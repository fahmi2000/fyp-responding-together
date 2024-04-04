import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { projectAuth } from './firebase/config';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/md-light-deeppurple/theme.css'
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Password from 'primevue/password';
import Button from 'primevue/button';
import TabMenu from 'primevue/tabmenu';


let app;

projectAuth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App);

        app.use(router);
        app.use(PrimeVue);
        app.component('FloatLabel', FloatLabel);
        app.component('InputText', InputText);
        app.component('Password', Password);
        app.component('Button', Button);
        app.component('TabMenu', TabMenu);

        app.mount('#app');
    }
});
