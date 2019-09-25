import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

var base = {
    input: './src/index.js',
    output: {
        exports: 'named',
        strict: true
    },
    plugins: [
        resolve({
            browser: true
        }),
        commonjs()
    ]
};

const input = base.input;
const output = {
    ...base.output,
    name: 'mpAdobeHBKit'
};
const plugins = [...base.plugins];

const iifeBuild = {
    input,
    output: {
        ...output,
        format: 'iife',
        file: 'dist/AdobeHBKit.iife.js'
    },
    plugins: [...plugins]
};

const esmBuild = {
    input,
    output: {
        ...output,
        format: 'esm',
        file: 'dist/AdobeHBKit.esm.js'
    },
    plugins: [...plugins]
};

export default [esmBuild, iifeBuild];
