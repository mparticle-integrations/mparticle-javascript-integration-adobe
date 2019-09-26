import commonjs from 'rollup-plugin-commonjs';

var base = {
    input: './src/index.js',
    output: {
        exports: 'named',
        strict: true
    },
    plugins: [
        commonjs()
    ]
};

const input = base.input;
const output = {
    ...base.output,
    name: 'mpAdobeHBKit'
};
const plugins = [...base.plugins];

const esmBuild = {
    input,
    output: {
        ...output,
        format: 'esm',
        file: 'dist/AdobeHBKit.esm.js'
    },
    plugins: [...plugins]
};

export default [esmBuild];
