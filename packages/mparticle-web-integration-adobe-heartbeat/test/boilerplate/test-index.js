window.MockHttpServer = require('./mockhttprequest.js');
window.should = require('should');
require('../../node_modules/mparticle-sdk-javascript/build/mParticle.common.js');
mParticle.addForwarder = function(forwarder) {
    mParticle.forwarder = new forwarder.constructor();
};
require('../../node_modules/@mparticle/web-kit-wrapper/index.js');
require('../tests.js');
