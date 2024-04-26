import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { projectAuth } from './firebase/config';

import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/md-light-deeppurple/theme.css';
import 'primeflex/primeflex.css';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional


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
        app.component('Menubar', Menubar);
        app.component('Dropdown', Dropdown);
        app.component('DataTable', DataTable);
        app.component('Column', Column);
        app.component('ColumnGroup', ColumnGroup);
        app.component('Row', Row);

        app.mount('#app');
    }
});
