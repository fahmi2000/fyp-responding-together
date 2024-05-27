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
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Carousel from 'primevue/carousel';
import Skeleton from 'primevue/skeleton';
import Message from 'primevue/message';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

let app;

projectAuth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App);

        app.use(router);
        app.use(PrimeVue);
        app.use(ToastService);
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
        app.component('Dialog', Dialog);
        app.component('Fieldset', Fieldset);
        app.component('Divider', Divider);
        app.component('Toast', Toast);
        app.component('Calendar', Calendar);
        app.component('Card', Card);
        app.component('Carousel', Carousel);
        app.component('Skeleton', Skeleton);
        app.component('Message', Message);
        app.component('TabView', TabView);
        app.component('TabPanel', TabPanel);
        app.component('IconField', IconField);
        app.component('InputIcon', InputIcon);

        app.mount('#app');
    }
});
