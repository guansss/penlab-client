/// <reference types="vite/client" />

declare module '*.vue' {
    import { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
    VITE_SERVER: string;
    VITE_API_SERVER: string;
    VITE_GA_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module 'highlight.js/lib/languages/*' {
    export default function (): any;
}
