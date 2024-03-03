import 'manatsu/style';
import './assets/style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createManatsu, registerComponents } from 'manatsu';
import App from './App.vue';
import { useStore } from './store';

const app = createApp(App);
const pinia = createPinia();
const manatsu = createManatsu({ darkMode: true });

registerComponents(app);

app.use(pinia);
app.use(manatsu);

app.config.errorHandler = (err) => {
  if (err instanceof Error) {
    app.runWithContext(() => {
      const store = useStore();
      store.error = err;
    });
  }
};

app.mount('#app');
