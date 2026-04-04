import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue';
import Aura from '@primevue/themes/aura';
import '@/classes/utils/array';
import InstanceFormatar, { Formatar } from "@/classes/utils/formatar";

import '@/style.css';
import '@/assets/layout/bootstrap/css/bootstrap.min.css';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: 'light'
        }
    }
});

app.config.globalProperties.$formatar = InstanceFormatar;
app.provide("formatar", InstanceFormatar);

app.mount('#app');

declare module "@vue/runtime-core" {
    export interface ComponentCustomProperties {
        $formatar: Formatar;
    }
}