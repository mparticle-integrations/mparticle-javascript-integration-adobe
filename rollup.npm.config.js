import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'src/AdobeNPM.temp.js',
        output: {
            file: 'dist/Adobe.npm.common.js',
            format: 'cjs',
            strict: false
        },
        plugins: [
            resolve(),
            commonjs()
        ]
    },
    {
        input: 'src/AdobeNPM.temp.js',
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