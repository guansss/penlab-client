import Vue from 'vue';
import Vuex from 'vuex';

import Debug from 'debug';

const debug = Debug('plab:store');

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        darkTheme: !!+localStorage.darkTheme,
        darkThemeTransitionOrigin: [0, 0]
    },
    mutations: {
        /**
         * @param state
         * @param {Boolean|Object} arg
         */
        setDarkTheme(state, arg) {
            let dark;

            if (typeof arg === 'object') {
                dark = arg.dark;
                state.darkThemeTransitionOrigin = arg.origin;
            } else {
                dark = arg;
            }

            dark = !!dark;
            state.darkTheme = dark;
            localStorage.darkTheme = +dark;
        }
    },
    actions: {},

    modules: {
        article: {
            namespaced: true,
            state: {
                headings: []
            },
            mutations: {
                updateHeadings(state, headings) {
                    state.headings = headings;
                }
            },
            actions: {}
        }
    }
});
