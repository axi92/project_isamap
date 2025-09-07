import { createApp } from 'vue';
import { createPinia } from 'pinia';
import mitt from 'mitt';
import App from './App.vue';
import router from './router';
import { EventService } from './!custom/event/event.service';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';

// Set dark mode before the vue app even renders
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('app-dark');
}

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    }
  }
});
app.use(createPinia());
app.use({
  install: (app) => {
    const emitter = mitt();
    const es = new EventService(emitter);
    app.provide('es', es);
  }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
