const path = require('path');
const cleaner = require('rollup-plugin-cleaner');
const external = require('rollup-plugin-peer-deps-external');
const postcss = require('rollup-plugin-postcss');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const { ifProd } = require('./utils/env');

module.exports = {
    plugins: [
        external(),
        postcss({
            modules: {
                camelCase: true,
                generateScopedName: '[hash:base64]',
            },
            autoModules: false,
            minimize: false,
            extensions: ['.css', '.scss']
        }),
        json(),
        nodeResolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            browser: true
        }),
        babel({
            exclude: '**/node_modules/**',
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            babelHelpers: 'runtime',
        }),
        commonjs(),
        ifProd(cleaner({
            targets: [
                path.join(process.cwd(), 'lib')
            ],
        }))
    ].filter(Boolean),
    external: [
        /@babel\/runtime/
    ]
};

