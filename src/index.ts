import 'manatsu/style';
import './assets/style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createManatsu } from 'manatsu';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);
const pinia = createPinia();
const manatsu = createManatsu();

app.use(router);
app.use(pinia);
app.use(manatsu);

void router.push('/');
void router.isReady().then(() => {
  app.mount('#app');
});
