function Common() {
    this.playheadPosition = 0;
    this.startupTime = 0;
    this.droppedFrames = 0;
    this.bitRate = 0;
    this.fps = 0;
}

var common = Common;

/*
A non-ecommerce event has the following schema:

{
    DeviceId: "a80eea1c-57f5-4f84-815e-06fe971b6ef2",
    EventAttributes: {test: "Error", t: 'stack trace in string form'},
    EventName: "Error",
    MPID: "123123123123",
    UserAttributes: {userAttr1: 'value1', userAttr2: 'value2'},
    UserIdentities: [{Identity: 'email@gmail.com', Type: 7}]
    User Identity Types can be found here:
}

*/

var MediaEventType = {
    Play: 23,
    Pause: 24,
    MediaContentEnd: 25,
    SessionStart: 30,
    SessionEnd: 31,
    SeekStart: 32,
    SeekEnd: 33,
    BufferStart: 34,
    BufferEnd: 35,
    UpdatePlayheadPosition: 36,
    AdClick: 37,
    AdBreakStart: 38,
    AdBreakEnd: 39,
    AdStart: 40,
    AdEnd: 41,
    AdSkip: 42,
    SegmentStart: 43,
    SegmentEnd: 44,
    SegmentSkip: 45,
    UpdateQoS: 46
};

function EventHandler(common) {
    this.common = common || {};
}
EventHandler.prototype.logEvent = function(event) {
    switch (event.EventCategory) {
        case MediaEventType.AdBreakStart:
            var adBreakObject = this.common.MediaHeartbeat.createAdBreakObject(
                event.AdBreak.title,
                event.AdBreak.placement || 0, // TODO: Ad Break Object doesn't support placement yet
                this.common.playheadPosition
            );

            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.AdBreakStart,
                adBreakObject
            );
            break;
        case MediaEventType.AdBreakEnd:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.AdBreakComplete
            );
            break;
        case MediaEventType.AdStart:
            var adObject = this.common.MediaHeartbeat.createAdObject(
                event.AdContent.title,
                event.AdContent.id,
                event.AdContent.placement,
                event.AdContent.duration
            );

            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.AdStart,
                adObject
            );
            break;
        case MediaEventType.AdEnd:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.AdComplete
            );
            break;
        case MediaEventType.AdSkip:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.AdSkip
            );
            break;
        case MediaEventType.AdClick:
            // This is not supported in Adobe Heartbeat
            console.warn('Ad Click is not a supported Adobe Heartbeat Event');
            break;
        case MediaEventType.BufferStart:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.BufferStart
            );
            break;
        case MediaEventType.BufferEnd:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.BufferComplete
            );
            break;
        case MediaEventType.MediaContentEnd:
            this.common.mediaHeartbeat.trackComplete();
            break;
        case MediaEventType.SessionStart:
            var contentType = getContentType(event.ContentType);
            var streamType = getStreamType(
                event.StreamType,
                contentType,
                this.common.MediaHeartbeat.StreamType
            );

            var adobeMediaObject = this.common.MediaHeartbeat.createMediaObject(
                event.ContentTitle,
                event.ContentId,
                event.Duration,
                streamType,
                contentType
            );

            this.common.mediaHeartbeat.trackSessionStart(adobeMediaObject);
            break;

        case MediaEventType.SessionEnd:
            this.common.mediaHeartbeat.trackSessionEnd();
            break;
        case MediaEventType.Play:
            this.common.mediaHeartbeat.trackPlay();
            break;
        case MediaEventType.Pause:
            this.common.mediaHeartbeat.trackPause();
            break;
        case MediaEventType.UpdatePlayheadPosition:
            this.common.playheadPosition = event.PlayheadPosition;
            break;
        case MediaEventType.SeekStart:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.SeekStart
            );
            break;
        case MediaEventType.SeekEnd:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.SeekComplete
            );
            break;
        case MediaEventType.SegmentStart:
            var chapterObject = this.common.MediaHeartbeat.createChapterObject(
                event.Segment.title,
                event.Segment.index,
                event.Segment.duration,
                this.common.playheadPosition
            );

            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.ChapterStart,
                chapterObject
            );
            break;
        case MediaEventType.SegmentEnd:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.ChapterComplete
            );
            break;
        case MediaEventType.SegmentSkip:
            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.ChapterSkip
            );
            break;
        case MediaEventType.UpdateQoS:
            this.common.startupTime = event.QoS.startupTime;
            this.common.droppedFrames = event.QoS.droppedFrames;
            this.common.bitRate = event.QoS.bitRate;
            this.common.fps = event.QoS.fps;

            var qosObject = this.common.MediaHeartbeat.createQoSObject(
                this.common.bitRate,
                this.common.startupTime,
                this.common.fps,
                this.common.droppedFrames
            );

            this.common.mediaHeartbeat.trackEvent(
                this.common.MediaHeartbeat.Event.BitrateChange,
                qosObject
            );
            break;
        default:
            console.error('Unknown Event Type', event);
            return false;
    }
};

var getStreamType = function(streamType, contentType, types) {
    switch (streamType) {
        case 'Podcast':
        case 'PODCAST':
            return types.PODCAST;
        case 'OnDemand':
        case 'ONDEMAND':
        case 1:
            if (contentType === 'Video') {
                return types.VOD;
            } else {
                return types.AOD;
            }
        case 'Live':
        case 'LIVE':
        case 0:
            return types.LIVE;
        default:
            // If it's an unknown type, just pass it through to Adobe
            return streamType;
    }
};

var getContentType = function(contentType) {
    switch (contentType) {
        case 'Video':
        case 'video':
        case 0:
            return 'Video';
        case 'Audio':
        case 'audio':
        case 1:
            return 'Audio';
        default:
            // If it's an unknown type, just pass it through to Adobe
            return contentType;
    }
};

var eventHandler = EventHandler;

var Initialization = {
    name: 'AdobeHeartbeat',
    moduleId: 128,
    /*  ****** Fill out initForwarder to load your SDK ******
    Note that not all arguments may apply to your SDK initialization.
    These are passed from mParticle, but leave them even if they are not being used.
    forwarderSettings contain settings that your SDK requires in order to initialize
    userAttributes example: {gender: 'male', age: 25}
    userIdentities example: { 1: 'customerId', 2: 'facebookId', 7: 'emailid@email.com' }
    additional identityTypes can be found at https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/src/types.js#L88-L101
*/
    initForwarder: function(
        settings,
        testMode,
        userAttributes,
        userIdentities,
        processEvent,
        eventQueue,
        isInitialized,
        common
    ) {
        if (!testMode) {
            /* Load your Web SDK here using a variant of your snippet from your readme that your customers would generally put into their <head> tags
               Generally, our integrations create script tags and append them to the <head>. Please follow the following format as a guide:
            */
            var adobeHeartbeatSdk = document.createElement('script');
            adobeHeartbeatSdk.type = 'text/javascript';
            adobeHeartbeatSdk.async = true;
            adobeHeartbeatSdk.src = ''; // TODO: Get this url from Sam
            (
                document.getElementsByTagName('head')[0] ||
                document.getElementsByTagName('body')[0]
            ).appendChild(adobeHeartbeatSdk);
            adobeHeartbeatSdk.onload = function() {
                if (ADB && eventQueue.length > 0) {
                    // Process any events that may have been queued up while forwarder was being initialized.
                    for (var i = 0; i < eventQueue.length; i++) {
                        processEvent(eventQueue[i]);
                    }
                    // now that each queued event is processed, we empty the eventQueue
                    eventQueue = [];
                }
                isInitialized = this.initHeartbeat(
                    settings,
                    common,
                    ADB,
                    testMode
                );
            };
        } else {
            // For testing, you should fill out this section in order to ensure any required initialization calls are made,
            // clientSDKObject.initialize(forwarderSettings.apiKey)
            isInitialized = this.initHeartbeat(settings, common, ADB, testMode);
        }
    },
    initHeartbeat: function(settings, common, adobeSDK, testMode) {
        try {
            // Init App Measurement with Visitor
            var appMeasurement = new AppMeasurement(settings.reportSuiteID);
            appMeasurement.visitor = Visitor.getInstance(
                settings.organizationID
            );
            appMeasurement.trackingServer = settings.trackingServerURL;
            appMeasurement.account = settings.reportSuiteID;
            appMeasurement.pageName = document.title;
            appMeasurement.charSet = 'UTF­8';

            // Init Media Heartbeat

            var MediaHeartbeat = adobeSDK.va.MediaHeartbeat;
            var MediaHeartbeatConfig = adobeSDK.va.MediaHeartbeatConfig;
            var MediaHeartbeatDelegate = adobeSDK.va.MediaHeartbeatDelegate;
            var mediaConfig = new MediaHeartbeatConfig();
            common.MediaHeartbeat = MediaHeartbeat;

            mediaConfig.trackingServer = settings.mediaTrackingServerURL;
            mediaConfig.ssl = settings.useSSL;

            var mediaDelegate = new MediaHeartbeatDelegate();

            mediaDelegate.getCurrentPlaybackTime = function() {
                return common.playheadPosition;
            };

            mediaDelegate.getQoSObject = function() {
                return MediaHeartbeat.createQoSObject(
                    common.bitRate,
                    common.startupTime,
                    common.fps,
                    common.droppedFrames
                );
            };

            var mediaHeartbeat = new MediaHeartbeat(
                mediaDelegate,
                mediaConfig,
                appMeasurement
            );
            common.mediaHeartbeat = mediaHeartbeat;
        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }
};

var initialization = Initialization;

//saving here in case node moules gets rewritten

// =============== REACH OUT TO MPARTICLE IF YOU HAVE ANY QUESTIONS ===============
//
//  Copyright 2018 mParticle, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.





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

function constructor() {
    var self = this,
        isInitialized = false,
        reportingService,
        eventQueue = [];

    self.moduleId = initialization.moduleId;
    self.common = new common();

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
            initialization.initForwarder(
                settings,
                testMode,
                userAttributes,
                userIdentities,
                processEvent,
                eventQueue,
                isInitialized,
                self.common
            );
            self.eventHandler = new eventHandler(self.common);

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
                    reportEvent = logEvent(event);
                }
                if (reportEvent === true && reportingService) {
                    reportingService(self, event);
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

    function logEvent(event) {
        try {
            self.eventHandler.logEvent(event);
            return true;
        } catch (e) {
            return {
                error: 'Error logging event on forwarder ' + name + '; ' + e
            };
        }
    }

    this.init = initForwarder;
    this.process = processEvent;
}

if (window && window.mParticle && window.mParticle.addForwarder) {
    window.mParticle.addForwarder({
        constructor: constructor
    });
}

var src = {
    AdobeHbkConstructor: constructor
};
var src_1 = src.AdobeHbkConstructor;

export default src;
export { src_1 as AdobeHbkConstructor };
