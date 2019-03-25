import './styles/main.styl';

import Vue from 'vue';
import Vuetify from 'vuetify';

import App from './App.vue';
import router from './router';
import store from './store';

import vuetifyConfig from './utils/vuetify-config';

Vue.config.productionTip = false;

Vue.use(Vuetify, vuetifyConfig);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

