import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [{
    input: 'src/AdobeKit-dev.js',
    output: {
        file: 'src/AdobeClientSideKit-temp.js',
        format: 'iife',
        exports: 'named',
        name: 'mpAdobeKit',
        strict: false
    },
    plugins: [
        resolve({
            browser: true
        }),
        commonjs()
    ]
}];