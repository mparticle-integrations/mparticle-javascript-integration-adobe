var MODULE = process.env.MODULE;

var files = {
    client: 'packages/AdobeClient/src/AdobeClientSideKit.js',
    server: 'packages/AdobeServer/src/AdobeServerSideKit.js'
};

module.exports = {
    setupFiles: [
        'test/setup/mParticle.js',
        'test/mockhttprequest.js',
        files[MODULE]
    ]
};