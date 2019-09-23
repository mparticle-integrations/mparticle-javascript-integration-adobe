import resolve from 'rollup-plugin-node-resolve';

const { BUILD } = process.env;

const input = {
    server_iife: 'dist/AdobeServerSideKit.esm.js',
    server_cjs: 'dist/AdobeServerSideKit.esm.js',
    client_iife: 'dist/AdobeClientSideKit.esm.js',
    client_cjs: 'dist/AdobeClientSideKit.esm.js'
}

const outputOptions = {
    strict: false
};

const builds = {
    // for dynamic script tag loading of adobe server side kit
    server_iife: {
        output: {
            ...outputOptions,
            name: 'mParticleAdobe',
            file: 'dist/AdobeServerSideKit.iife.js',
            format: 'iife',
        },
        plugins: [resolve()]
    },
    // creates npm module for adobe server side kit
    server_cjs: {
        output: {
            ...outputOptions,
            name: 'mParticleAdobe',
            file: "dist/AdobeServerSideKit.common.js",
            format: "cjs",
        },
        plugins: [resolve()]
    },
    // for dynamic script tag loading of adobe client side kit
    client_iife: {
        output: {
            ...outputOptions,
            name: 'mParticleAdobe',
            file: 'dist/AdobeClientSideKit.iife.js',
            format: 'iife',
        },
        plugins: [resolve()]
    },
   // creates npm module for adobe client side kit
    client_cjs: {
        output: {
            ...outputOptions,
            name: 'mParticleAdobe',
            file: "dist/AdobeClientSideKit.common.js",
            format: "cjs",
        },
        plugins: [resolve()]
    }
}

var selectedBuild = {
    input: input[BUILD],
    ...builds[BUILD]
};

export default selectedBuild;