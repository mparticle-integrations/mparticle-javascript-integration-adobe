const { BUILD } = process.env;

const input = {
    server_iife: 'packages/AdobeServer/dist/AdobeServerSideKit.esm.js',
    server_cjs: 'packages/AdobeServer/dist/AdobeServerSideKit.esm.js',
    client_iife: 'packages/AdobeClient/dist/AdobeClientSideKit.esm.js',
    client_cjs: 'packages/AdobeClient/dist/AdobeClientSideKit.esm.js'
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
            file: 'packages/AdobeServer/dist/AdobeServerSideKit.iife.js',
            format: 'iife',
        }
    },
    // creates npm module for adobe server side kit
    server_cjs: {
        output: {
            ...outputOptions,
            name: 'mParticleAdobe',
            file: "packages/AdobeServer/dist/AdobeServerSideKit.common.js",
            format: "cjs",
        }
    },
    // for dynamic script tag loading of adobe client side kit
    client_iife: {
        output: {
            ...outputOptions,
            name: 'mParticleAdobe',
            file: 'packages/AdobeClient/dist/AdobeClientSideKit.iife.js',
            format: 'iife',
        }
    },
   // creates npm module for adobe client side kit
    client_cjs: {
        output: {
            ...outputOptions,
            name: 'mParticleAdobe',
            file: "packages/AdobeClient/dist/AdobeClientSideKit.common.js",
            format: "cjs",
        }
    }
}

var selectedBuild = {
    input: input[BUILD],
    ...builds[BUILD]
};

export default selectedBuild;