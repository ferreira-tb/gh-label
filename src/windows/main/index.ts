import '@/assets/index.css';
import App from './App.vue';
import { createApp } from 'vue';
import { useStore } from '@/stores';
import { createPinia } from 'pinia';
import { createManatsu, defaultErrorHandler } from 'manatsu';

const app = createApp(App);
const pinia = createPinia();

const manatsu = createManatsu({
  errorHandler(err) {
    defaultErrorHandler.call(this, err);
    if (err instanceof Error) {
      this.runWithContext(() => {
        useStore().error = err;
      });
    }
  }
});

app.use(pinia);
app.use(manatsu);

app.mount('#app');
