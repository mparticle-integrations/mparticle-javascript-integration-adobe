/* eslint-disable no-undef*/
describe('AdobeServerSide Forwarder', function () {
    window.mParticle.isTestEnvironment = true;
    var server = new MockHttpServer(),
        MockVisitorInstance = function() {
            this.visitorInstance = null;
            this.orgId = null;
            this.getInstanceCalled = false;
            this.userId = null;

            this.setCustomerIDs = function(userIdObject) {
                this.userId = userIdObject;
            };
            this.getCustomerIDs = function() {
                return this.userId;
            };
        },

        Visitor = {
            getInstance: function(orgId) {
                var instance = new MockVisitorInstance;
                instance.orgId = orgId;
                instance.getInstanceCalled = true;
                instance.getMarketingCloudVisitorID = function(cb) {
                    cb('MCID test');
                };
                return instance;
            }
        };

    var MockAppMeasurement = function (reportSuiteID) {
        this.reportSuiteID = reportSuiteID;
        this.visitor = {};
    };
    var MockMediaHeartbeat = function () {
        var self = this;
        this.calls = [];
        this.trackEventCalled = false;
        this.trackPlayCalled = false;
        this.trackPauseCalled = false;
        this.trackCompleteCalled = false;
        this.trackSessionStartCalled = false;
        this.trackSessionEndCalled = false;

        this.trackEventCalledWith;
        this.trackSessionStartCalledWith;

        this.trackComplete = function () {
            this.trackCompleteCalled = true;
            return true;
        };
        this.trackEvent = function (eventName, eventObject) {
            this.trackEventCalled = true;

            var dataObject;

            if (
                eventObject &&
                eventObject.hasOwnProperty('b') &&
                eventObject.b.hasOwnProperty('data')
            ) {
                dataObject = eventObject.b.data;
            }

            this.trackEventCalledWith = {
                eventName: eventName,
                eventObject: dataObject
            };
        };
        this.trackPlay = function () {
            window.trackPlayCalled = true;
            return true;
        };
        this.trackPause = function () {
            self.trackPauseCalled = true;
            return true;
        };
        this.trackSessionStart = function (mediaObject, customVideoMeta) {
            self.trackSessionStartCalled = true;
            var dataObject;
            if (
                mediaObject &&
                mediaObject.hasOwnProperty('b') &&
                mediaObject.b.hasOwnProperty('data')
            ) {
                dataObject = mediaObject.b.data;
            }
            self.trackSessionStartCalledWith = {
                mediaObject: dataObject,
                customVideoMeta: customVideoMeta
            };
            return true;
        };
        this.trackSessionEnd = function () {
            self.trackSessionEndCalled = true;
            return true;
        };
    };
    MockMediaHeartbeat.StreamType = {
        AOD: 'aod',
        AUDIOBOOK: 'audiobook',
        LINEAR: 'linear',
        LIVE: 'live',
        PODCAST: 'podcast',
        VOD: 'vod'
    };
    MockMediaHeartbeat.MediaType = { Video: 'video', Audio: 'audio' };
    MockMediaHeartbeat.Event = {
        AdBreakComplete: 'adBreakComplete',
        AdComplete: 'adComplete',
        AdSkip: 'adSkip',
        AdStart: 'adStart',
        BitrateChange: 'bitrateChange',
        BufferComplete: 'bufferComplete',
        BufferStart: 'bufferStart',
        ChapterComplete: 'chapterComplete',
        ChapterSkip: 'chapterSkip',
        ChapterStart: 'chapterStart',
        SeekComplete: 'seekComplete',
        SeekStart: 'seekStart',
        TimedMetadataUpdate: 'timedMetadataUpdate',
        AdBreakStart: 'adBreakStart'
    };
    MockMediaHeartbeat.createAdBreakObject = function (
        name,
        position,
        startTime
    ) {
        return {
            b: {
                data: {
                    name: name,
                    position: position,
                    startTime: startTime
                }
            }
        };
    };
    MockMediaHeartbeat.createAdObject = function (name, adId, position, length) {
        return {
            b: {
                data: {
                    name: name,
                    adId: adId,
                    position: position,
                    length: length
                }
            }
        };
    };
    MockMediaHeartbeat.createChapterObject = function (
        name,
        position,
        length,
        startTime
    ) {
        return {
            b: {
                data: {
                    name: name,
                    position: position,
                    length: length,
                    startTime: startTime
                }
            }
        };
    };
    MockMediaHeartbeat.createMediaObject = function (
        title,
        id,
        duration,
        streamType,
        contentType
    ) {
        return {
            b: {
                data: {
                    name: title,
                    mediaid: id,
                    length: duration,
                    streamType: streamType,
                    mediaType: contentType
                }
            }
        };
    };

    MockMediaHeartbeat.createQoSObject = function (
        bitrate,
        startuptime,
        fps,
        droppedFrames
    ) {
        return {
            b: {
                data: {
                    bitrate: bitrate,
                    startupTime: startuptime,
                    fps: fps,
                    droppedFrames: droppedFrames
                }
            }
        };
    };

    var MockMediaHeartbeatConfig = function () { };
    var MockMediaHeartbeatDelegate = function () { };
    var settings = {
        productIncrementor: '[{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;event2&quot;,&quot;map&quot;:&quot;PI1&quot;,&quot;jsmap&quot;:&quot;3373707&quot;},{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;event6&quot;,&quot;map&quot;:&quot;PI2&quot;,&quot;jsmap&quot;:&quot;3373707&quot;}]',
        commerceEventsAsTrackState: '[{&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;8546102375969542712&quot;,&quot;map&quot;:null}]',
        productMerchandising: '[{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;eVar2&quot;,&quot;map&quot;:&quot;PM1&quot;,&quot;jsmap&quot;:&quot;50511102&quot;},{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;eVar3&quot;,&quot;map&quot;:&quot;PM2&quot;,&quot;jsmap&quot;:&quot;3355&quot;}]',
        hvars: '[{&quot;maptype&quot;:&quot;EventAttributeClassDetails.ScreenView.Id&quot;,&quot;value&quot;:&quot;hier1&quot;,&quot;map&quot;:&quot;2361242877491637581&quot;,&quot;jsmap&quot;:&quot;-1095764254&quot;},{&quot;maptype&quot;:&quot;EventAttributeClassDetails.ScreenView.Id&quot;,&quot;value&quot;:&quot;hier2&quot;,&quot;map&quot;:&quot;2907988680309444828&quot;,&quot;jsmap&quot;:&quot;-498368463&quot;}]',
        evars: '[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;eVar1&quot;,&quot;map&quot;:&quot;color&quot;}]',
        props: '[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop2&quot;,&quot;map&quot;:&quot;gender&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop2&quot;,&quot;map&quot;:&quot;Navigation&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop3&quot;,&quot;map&quot;:&quot;color&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop4&quot;,&quot;map&quot;:&quot;button_number&quot;},{&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop5&quot;,&quot;map&quot;:&quot;joetest&quot;}]',
        events: '[{&quot;maptype&quot;:&quot;EventClassDetails.Id&quot;,&quot;value&quot;:&quot;event1&quot;,&quot;map&quot;:&quot;1821516884252957430&quot;,&quot;jsmap&quot;:&quot;750057686&quot;},{&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;event2&quot;,&quot;map&quot;:&quot;-3234618101041058100&quot;,&quot;jsmap&quot;:&quot;-1107730368&quot;},{&quot;maptype&quot;:&quot;EventClassDetails.Id&quot;,&quot;value&quot;:&quot;event3&quot;,&quot;map&quot;:&quot;-5153013487206524777&quot;,&quot;jsmap&quot;:&quot;564473837&quot;},{&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;event7&quot;,&quot;map&quot;:&quot;discount&quot;,&quot;jsmap&quot;:&quot;-100343221&quot;}]',
        contextVariables: '[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;contextTestValue&quot;,&quot;map&quot;:&quot;c1&quot;}]',
        organizationID: 'abcde',
        trackingServer: 'trackingServer.com',
        trackingServerURLSecure: 'trackingServers.com',
        timestampOption: 'notallowed',
        reportSuiteIDs: 'testReportSuiteId',
        setGlobalObject: 'True'
    };

    beforeAll(function () {
        server.start();
    });
    
    beforeEach(function() {
        window.AppMeasurement = MockAppMeasurement;
        window.Visitor = Visitor;
        window.ADB = {
            va: {
                MediaHeartbeat: MockMediaHeartbeat,
                MediaHeartbeatConfig: MockMediaHeartbeatConfig,
                MediaHeartbeatDelegate: MockMediaHeartbeatDelegate
            }
        };
        window.s = null;
        window.mockInstances = {};
        window.mParticleAndroid = null;
        window.mParticle.isIOS = null;
        window.mParticle.useCookieStorage = false;
        mParticle.isDevelopmentMode = false;
        mParticle.config = {
            requestConfig: false,
            workspaceToken: 'testworkspacetoken',
            kitConfigs: [
                {
                    name: 'Adobe',
                    settings: settings,
                    eventNameFilters: [],
                    eventTypeFilters: [],
                    attributeFilters: [],
                    screenNameFilters: [],
                    pageViewAttributeFilters: [],
                    userIdentityFilters: [],
                    userAttributeFilters: [],
                    moduleId: 1,
                    isDebug: false,
                    HasDebugString: 'false',
                    isVisible: true
                }
            ]
        };
        mParticle.init('apikey', mParticle.config);
    });

    test('should call setIntegrationAttribute properly', function(done) {
        expect(mParticle.getIntegrationAttributes(124).mid).toBe('MCID test');
        expect(mParticle._getIntegrationDelays()[124]).toBe(false);

        done();
    });

    test('should log play event', function(done) {
        settings.mediaTrackingServer = 'test';
        mParticle.init('apiKey', mParticle.config);

        mParticle.logBaseEvent({ name: 'play event', messageType: 20, eventType: 23 });
        expect(window.trackPlayCalled).toBe(true);
        done();
    });
});
