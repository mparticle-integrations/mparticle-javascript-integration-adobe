import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'src/AdobeServerSideKit-dev.js',
        output: {
            file: 'src/AdobeServerSideKit.iife.temp.js',
            format: 'iife',
            exports: 'named',
            name: 'mpAdobeKitServer',
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
        input: 'src/AdobeServerSideKit-dev.js',
        output: {
            file: 'src/AdobeServerSideKit.esm.temp.js',
            format: 'esm',
            exports: 'named',
            name: 'mpAdobeKitServer',
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