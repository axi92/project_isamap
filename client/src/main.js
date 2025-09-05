import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { EventEmitter2 } from 'eventemitter2';
import { EventService } from './!custom/event/event.service';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark'
    }
  }
});
app.use(createPinia());
app.use({
  install: (app) => {
    const em = new EventEmitter2();
    const es = new EventService(em);
    app.provide('es', es);
  }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
