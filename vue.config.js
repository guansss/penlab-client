const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
            },
        },
    },
    configureWebpack: {
        entry: ['whatwg-fetch', 'web-animations-js', './src/main.js'],
        plugins: [
            new VuetifyLoaderPlugin(),
        ],/*,
        module: {
            rules: [
                {
                    test: /\.styl$/,
                    loader: ['vue-style-loader', 'css-loader', 'stylus-loader']
                }
            ]
        }*/
    },
};
