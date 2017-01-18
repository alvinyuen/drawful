'use strict';

const webpack = require('webpack');

module.exports = {
    entry: './client/js/client.jsx',
    output: {
        path: __dirname,
        filename: './build/bundle.js'
    },
    context: __dirname,
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ["syntax-flow"]
            }
            },
            {
                test: /\.scss$/,
                loader: "style!css?sourceMap!sass?sourceMap"
            }]
    },
};