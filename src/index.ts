import '@/assets/style.css';
import 'manatsu/components/style';
import '@manatsu/style/themes/mana';
import App from '@/App.vue';
import { createApp } from 'vue';
import { useStore } from '@/store';
import { createPinia } from 'pinia';
import { createManatsu, registerComponents } from 'manatsu';

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
