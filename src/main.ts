import { createApp } from 'vue';
import App from './App.vue';
import { imgZoom } from './directives/img-zoom';
import { movable } from './directives/movable';
import { router } from './router';
import { listenForConsole } from './tools/vconsole';

const app = createApp(App);

imgZoom(app);
movable(app);

app.use(router);
app.mount('#app');

listenForConsole(router);
