import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [{
    input: 'src/AdobeServerSideKit-dev.js',
    output: {
        file: 'src/AdobeServerSideKit-temp.js',
        format: 'iife',
        exports: 'named',
        name: 'mp-adobe-kit',
        strict: false
    },
    plugins: [
        resolve({
            browser: true
        }),
        commonjs()
    ]
}];