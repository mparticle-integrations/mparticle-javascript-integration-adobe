import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [{
    input: 'src/AdobeClientSideKit-dev.js',
    output: {
        file: 'src/AdobeClientSideKit-temp.js',
        format: 'umd',
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
}
] 