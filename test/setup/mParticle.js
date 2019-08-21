var mParticle = require('@mparticle/web-sdk');

mParticle.addForwarder = function (forwarder) {
    mParticle.forwarder = new forwarder.constructor();
};