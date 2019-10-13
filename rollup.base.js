const path = require('path');
const babel = require('rollup-plugin-babel');
const cleaner = require('rollup-plugin-cleaner');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const external = require('rollup-plugin-peer-deps-external');
const postcss = require('rollup-plugin-postcss');
const json = require('rollup-plugin-json');
const { ifProd } = require('./utils/env');

module.exports = {
    plugins: [
        external(),
        postcss({
            modules: {
                camelCase: true,
                generateScopedName: '[hash:base64]',
            },
            minimize: false,
            extensions: ['.css', '.scss']
        }),
        json(),
        resolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            browser: true
        }),
        babel({
            exclude: '**/node_modules/**',
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            runtimeHelpers: true,
        }),
        commonjs(),
        ifProd(cleaner({
            targets: [
                path.join(process.cwd(), 'lib')
            ],
        }))
    ].filter(Boolean)
};

