import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'src/AdobeKit-dev.js',
        output: {
            file: 'src/AdobeClientSideKit.iife.temp.js',
            format: 'iife',
            exports: 'named',
            name: 'mpAdobeClientKit',
            strict: false
        },
        plugins: [
            resolve({
                browser: true
            }),
            commonjs()
        ]
    },
    {
        input: 'src/AdobeKit-dev.js',
        output: {
            file: 'src/AdobeClientSideKit.esm.temp.js',
            format: 'esm',
            exports: 'named',
            name: 'mpAdobeClientKit',
            strict: false
        },
        plugins: [
            resolve({
                browser: true
            }),
            commonjs()
        ]
    }
];