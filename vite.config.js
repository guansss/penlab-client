import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Inspect from 'vite-plugin-inspect';
import autoprefixer from 'autoprefixer';
import nested from 'postcss-nested';
import vueSvgPlugin from 'vite-plugin-vue-svg';
import { injectHtml, minifyHtml } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, 'env');

    return {
        plugins: [
            vue(),
            Inspect(),
            vueSvgPlugin({ defaultExport: 'component' }),
            minifyHtml(),
            injectHtml({ data: { ...env } }),
        ],
        css: {
            postcss: {
                plugins: [autoprefixer(), nested()],
            },
        },
        server: {
            host: true,
            port: 8080,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    pathRewrite: { '^/api': '' },
                },
            },
        },
    };
});
