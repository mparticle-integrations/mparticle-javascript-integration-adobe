import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'src/AdobeNPM-dev.js',
        output: {
            file: 'dist/Adobe.npm.common.js',
            format: 'cjs',
            exports: 'named',
            name: 'mpAdobeKitNPM',
            strict: false
        },
        plugins: [
            resolve(),
            commonjs()
        ]
    },
    {
        input: 'src/AdobeNPM-dev.js',
        output: {
            file: 'dist/Adobe.npm.esm.js',
            format: 'esm',
            exports: 'named',
            name: 'mpAdobeKitNPM',
            strict: false
        },
        plugins: [
            resolve(),
            commonjs()
        ]
    }
];