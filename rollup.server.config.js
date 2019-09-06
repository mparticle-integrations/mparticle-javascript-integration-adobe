import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: 'src/AdobeServerSideKit-dev.js',
        output: {
            // this temporary server file is 
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
    }
];