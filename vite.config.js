import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Inspect from 'vite-plugin-inspect';
import autoprefixer from 'autoprefixer';
import nested from 'postcss-nested';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), Inspect()],
    css: {
        postcss: {
            plugins: [autoprefixer(), nested()],
        },
    },
    server: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
            },
        },
    },
});
