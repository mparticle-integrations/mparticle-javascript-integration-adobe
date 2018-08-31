var Common = require('common');
var EventHandler = require('event-handler');
var Initialization = require('src/initialization');

var MessageType = {
    SessionStart: 1,
    SessionEnd: 2,
    PageView: 3,
    PageEvent: 4,
    CrashReport: 5,
    OptOut: 6,
    Commerce: 16,
    Media: 20
};

var isInitialized = false;
var reportingService;
var eventQueue;

function initForwarder(
    settings,
    service,
    testMode,
    trackerId,
    userAttributes,
    userIdentities
) {
    if (window.mParticle.isTestEnvironment) {
        reportingService = function() {};
    } else {
        reportingService = service;
    }

    try {
        Initialization.initForwarder(
            settings,
            testMode,
            userAttributes,
            userIdentities,
            processEvent,
            eventQueue,
            isInitialized,
            Common
        );
        this.eventHandler = new EventHandler(Common);

        isInitialized = true;
    } catch (e) {
        console.log('Failed to initialize ' + name + ' - ' + e);
    }
}

function processEvent(event) {
    var reportEvent = false;
    if (isInitialized) {
        try {
            if (event.EventDataType === MessageType.Media) {
                // Kits should just treat Media Events as generic Events
                reportEvent = this.eventHandler.logEvent(event);
            }
            if (reportEvent === true && reportingService) {
                reportingService(this, event);
                return 'Successfully sent to ' + name;
            } else {
                return (
                    'Error logging event or event type not supported on forwarder ' +
                    name
                );
            }
        } catch (e) {
            return 'Failed to send to ' + name + ' ' + e;
        }
    } else {
        eventQueue.push(event);
        return (
            'Cannot send to forwarder ' +
            name +
            ', not initialized. Event added to queue.'
        );
    }
}

module.exports = {
    init: initForwarder,
    process: processEvent
};
