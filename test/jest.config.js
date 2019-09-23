var MODULE = process.env.MODULE;

var files = {
    client: 'src/AdobeKit-dev.js',
    server: 'src/AdobeServerSideKit-dev.js'
};

module.exports = {
    setupFiles: [
        'test/setup/mParticle.js',
        'test/mockhttprequest.js',
        files[MODULE]
    ]
};