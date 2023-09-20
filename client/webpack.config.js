const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.ts',
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/signs', to: 'signs' },
            ],
        }),
        new Dotenv({
            path: '../.env',
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: false,
            scriptLoading: 'blocking',
            env: process.env,
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js',],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
    },
};
