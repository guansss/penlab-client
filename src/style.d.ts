// this file fixes typing errors on using CSS variables in Vue template
// https://github.com/vuejs/vue-next/issues/4741#issuecomment-936275184

import { CSSProperties } from 'vue';

declare module 'vue' {
  interface CSSProperties {
    [k: `--${string}`]: string;
  }
}
