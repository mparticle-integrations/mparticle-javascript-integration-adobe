/* eslint-disable no-undef*/
describe('Adobe Heartbeat Forwarder', function() {
    window.mParticle.isTestEnvironment = true;

    // -------------------DO NOT EDIT ANYTHING BELOW THIS LINE-----------------------
    var MessageTypes = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            AppStateTransition: 10,
            Profile: 14,
            Commerce: 16,
            Media: 20
        },
        MediaEventType = {
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
        },
        MediaContentType = {
            Video: 'Video',
            Audio: 'Audio'
        },
        MediaStreamType = {
            LiveStream: 'LiveStream',
            OnDemand: 'OnDemand'
        },
        IdentityType = {
            Other: 0,
            CustomerId: 1,
            Facebook: 2,
            Twitter: 3,
            Google: 4,
            Microsoft: 5,
            Yahoo: 6,
            Email: 7,
            Alias: 8,
            FacebookCustomAudienceId: 9,
            getName: function() {
                return 'CustomerID';
            }
        },
        ReportingService = function() {
            var self = this;

            this.id = null;
            this.event = null;

            this.cb = function(forwarder, event) {
                self.id = forwarder.id;
                self.event = event;
            };

            this.reset = function() {
                this.id = null;
                this.event = null;
            };
        },
        reportService = new ReportingService();

    // -------------------DO NOT EDIT ANYTHING ABOVE THIS LINE-----------------------
    // -------------------START EDITING BELOW:-----------------------
    // -------------------mParticle stubs - Add any additional stubbing to our methods as needed-----------------------
    mParticle.Identity = {
        getCurrentUser: function() {
            return {
                getMPID: function() {
                    return '123';
                }
            };
        }
    };
    // -------------------START EDITING BELOW:-----------------------
    var MockAppMeasurement = function(reportSuiteID) {
        this.reportSuiteID = reportSuiteID;
        this.visitor = {};
    };
    var MockVisitor = {
        getInstance: function(organizationID) {
            return { organizationID: organizationID };
        }
    };
    var MockMediaHeartbeat = function() {
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

        this.trackComplete = function() {
            this.trackCompleteCalled = true;
            return true;
        };
        this.trackEvent = function(eventName, eventObject, customMetaData) {
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
                eventObject: dataObject,
                customMetaData: customMetaData
            };
        };
        this.trackPlay = function() {
            self.trackPlayCalled = true;
            return true;
        };
        this.trackPause = function() {
            self.trackPauseCalled = true;
            return true;
        };
        this.trackSessionStart = function(mediaObject, customVideoMeta) {
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
        this.trackSessionEnd = function() {
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
    MockMediaHeartbeat.createAdBreakObject = function(
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
    MockMediaHeartbeat.createAdObject = function(name, adId, position, length) {
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
    MockMediaHeartbeat.createChapterObject = function(
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
    MockMediaHeartbeat.createMediaObject = function(
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

    MockMediaHeartbeat.createQoSObject = function(
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

    var MockMediaHeartbeatConfig = function() {};
    var MockMediaHeartbeatDelegate = function() {};

    beforeEach(function() {
        window.AppMeasurement = MockAppMeasurement;
        window.Visitor = MockVisitor;
        window.ADB = {
            va: {
                MediaHeartbeat: MockMediaHeartbeat,
                MediaHeartbeatConfig: MockMediaHeartbeatConfig,
                MediaHeartbeatDelegate: MockMediaHeartbeatDelegate
            }
        };
        // Include any specific settings that is required for initializing your SDK here
        var sdkSettings = {
            clientKey: '123456',
            appId: 'abcde',
            userIdField: 'customerId'
        };
        // You may require userAttributes or userIdentities to be passed into initialization
        var userAttributes = {
            color: 'green'
        };
        var userIdentities = [
            {
                Identity: 'customerId',
                Type: IdentityType.CustomerId
            },
            {
                Identity: 'email',
                Type: IdentityType.Email
            },
            {
                Identity: 'facebook',
                Type: IdentityType.Facebook
            }
        ];
        mParticle.forwarder.init(
            sdkSettings,
            reportService.cb,
            true,
            null,
            userAttributes,
            userIdentities
        );
    });

    it('should log a media event', function(done) {
        mParticle.forwarder.process({
            ContentTitle: 'Dancing Baby',
            EventDataType: MessageTypes.Media,
            EventCategory: MediaEventType.Play,
            EventName: 'Test Event',
            EventAttributes: {
                label: 'label',
                value: 200,
                category: 'category'
            }
        });

        window.mParticle.forwarder.common.mediaHeartbeat.trackPlayCalled.should.equal(
            true
        );

        done();
    });

    describe('Media Content ', function() {
        it('should have a valid payload', function(done) {
            mParticle.forwarder.process({
                ContentId: '5551212',
                ContentTitle: 'Dancing Baby',
                Duration: 120000,
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionStart,
                ContentType: MediaContentType.Video,
                StreamType: MediaStreamType.LiveStream
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionStartCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionStartCalledWith.mediaObject.should.eql(
                {
                    name: 'Dancing Baby',
                    mediaid: '5551212',
                    length: 120000,
                    streamType: 'live',
                    mediaType: 'Video'
                }
            );

            done();
        });
        it('should support Video On Demand', function(done) {
            mParticle.forwarder.process({
                ContentId: '5551212',
                ContentTitle: 'Dancing Baby',
                Duration: 120000,
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionStart,
                ContentType: MediaContentType.Video,
                StreamType: MediaStreamType.OnDemand
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionStartCalledWith.mediaObject.should.eql(
                {
                    name: 'Dancing Baby',
                    mediaid: '5551212',
                    length: 120000,
                    streamType: 'vod',
                    mediaType: 'Video'
                }
            );

            done();
        });

        it('should support Audio On Demand', function(done) {
            mParticle.forwarder.process({
                ContentId: '5551212',
                ContentTitle: 'Dancing Baby',
                Duration: 120000,
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionStart,
                ContentType: MediaContentType.Audio,
                StreamType: MediaStreamType.OnDemand
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionStartCalledWith.mediaObject.should.eql(
                {
                    name: 'Dancing Baby',
                    mediaid: '5551212',
                    length: 120000,
                    streamType: 'aod',
                    mediaType: 'Audio'
                }
            );

            done();
        });

        it('should support Live Video', function(done) {
            mParticle.forwarder.process({
                ContentId: '5551212',
                ContentTitle: 'Dancing Baby',
                Duration: 120000,
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionStart,
                ContentType: MediaContentType.Video,
                StreamType: MediaStreamType.LiveStream
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionStartCalledWith.mediaObject.should.eql(
                {
                    name: 'Dancing Baby',
                    mediaid: '5551212',
                    length: 120000,
                    streamType: 'live',
                    mediaType: 'Video'
                }
            );

            done();
        });

        it('should pass through an unrecognized content type', function(done) {
            mParticle.forwarder.process({
                ContentId: '5551212',
                ContentTitle: 'Dancing Baby',
                Duration: 120000,
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionStart,
                ContentType: 'postcard',
                StreamType: MediaStreamType.LiveStream
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionStartCalledWith.mediaObject.should.eql(
                {
                    name: 'Dancing Baby',
                    mediaid: '5551212',
                    length: 120000,
                    streamType: 'live',
                    mediaType: 'postcard'
                }
            );

            done();
        });

        it('should pass through an unrecognized stream type', function(done) {
            mParticle.forwarder.process({
                ContentId: '5551212',
                ContentTitle: 'Dancing Baby',
                Duration: 120000,
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionStart,
                ContentType: MediaContentType.Video,
                StreamType: 'brook'
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionStartCalledWith.mediaObject.should.eql(
                {
                    name: 'Dancing Baby',
                    mediaid: '5551212',
                    length: 120000,
                    streamType: 'brook',
                    mediaType: 'Video'
                }
            );

            done();
        });
    });

    describe('Events', function() {
        it('should handle Buffer Start', function(done) {
            mParticle.forwarder.process({
                BufferDuration: 123,
                BufferPercent: 20,
                BufferPosition: 111,
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.BufferStart
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'bufferStart'
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackEventCalledWith.eventObject
            ).equal(undefined);

            done();
        });

        it('should handle Buffer End', function(done) {
            mParticle.forwarder.process({
                BufferDuration: 123,
                BufferPercent: 20,
                BufferPosition: 111,
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.BufferEnd
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'bufferComplete'
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackEventCalledWith.eventObject
            ).equal(undefined);

            done();
        });

        it('should handle Media Content End', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.MediaContentEnd
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackCompleteCalled.should.equal(
                true
            );

            done();
        });

        it('should handle Media Start', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionStart
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionStartCalled.should.equal(
                true
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackSessionStartCalled.eventObject
            ).equal(undefined);

            done();
        });

        it('should handle Media End', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionEnd
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackSessionEndCalled.should.equal(
                true
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackSessionEndCalled.eventObject
            ).equal(undefined);

            done();
        });

        it('should handle Play', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.Play
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackPlayCalled.should.equal(
                true
            );

            done();
        });

        it('should handle Pause', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.Pause
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackPauseCalled.should.equal(
                true
            );

            done();
        });

        it('should handle Seek Start', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SeekStart
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'seekStart'
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackEventCalledWith.eventObject
            ).equal(undefined);

            done();
        });

        it('should handle Seek End', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SeekEnd
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'seekComplete'
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackEventCalledWith.eventObject
            ).equal(undefined);

            done();
        });

        it('should handle Segment Start', function(done) {
            mParticle.forwarder.common.playheadPosition = 245;
            mParticle.forwarder.process({
                Segment: {
                    title: 'The Gang Write Some Code',
                    index: 4,
                    duration: 36000
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SegmentStart
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'chapterStart'
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventObject.should.eql(
                {
                    name: 'The Gang Write Some Code',
                    position: 4,
                    length: 36000,
                    startTime: 245
                }
            );

            done();
        });

        it('should handle Segment End', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SegmentEnd
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'chapterComplete'
            );

            done();
        });

        it('should handle Segment Skip', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SegmentSkip
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'chapterSkip'
            );

            done();
        });

        it('should handle Update QoS', function(done) {
            mParticle.forwarder.process({
                QoS: {
                    bitRate: 4,
                    startupTime: 123,
                    fps: 32,
                    droppedFrames: 321
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.UpdateQoS
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'bitrateChange'
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventObject.should.eql(
                {
                    bitrate: 4,
                    startupTime: 123,
                    fps: 32,
                    droppedFrames: 321
                }
            );

            done();
        });
    });

    describe('Advertising', function() {
        it('should handle Ad Break Start with a valid payload', function(done) {
            mParticle.forwarder.common.playheadPosition = 42;
            mParticle.forwarder.process({
                AdBreak: {
                    id: '8675309',
                    title: 'mid-roll',
                    duration: 10000
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.AdBreakStart
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'adBreakStart'
            );
            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventObject.should.eql(
                {
                    name: 'mid-roll',
                    position: 0,
                    startTime: 42
                }
            );

            done();
        });

        it('should handle Ad Break End', function(done) {
            mParticle.forwarder.common.playheadPosition = 42;
            mParticle.forwarder.process({
                AdBreak: {
                    id: '8675309',
                    title: 'mid-roll',
                    duration: 10000
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.AdBreakEnd
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'adBreakComplete'
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackEventCalledWith.eventObject
            ).equal(undefined);

            done();
        });

        it('should handle Ad Start with a valid payload', function(done) {
            mParticle.forwarder.process({
                AdContent: {
                    id: '4423210',
                    advertiser: 'Moms Friendly Robot Company',
                    title: 'What?! Nobody rips off my kids but me!',
                    campaign: 'MomCorp Galactic Domination Plot 3201',
                    duration: 60000,
                    creative: 'A Fishful of Dollars',
                    siteid: 'moms',
                    placement: 2
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.AdStart
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'adStart'
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventObject.should.eql(
                {
                    name: 'What?! Nobody rips off my kids but me!',
                    adId: '4423210',
                    position: 2,
                    length: 60000
                }
            );

            done();
        });

        it('should handle Ad End', function(done) {
            mParticle.forwarder.process({
                AdContent: {
                    id: '4423210',
                    advertiser: 'Moms Friendly Robot Company',
                    title: 'What?! Nobody rips off my kids but me!',
                    campaign: 'MomCorp Galactic Domination Plot 3201',
                    duration: 60000,
                    creative: 'A Fishful of Dollars',
                    siteid: 'moms',
                    placement: 2
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.AdEnd
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'adComplete'
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackEventCalledWith.eventObject
            ).equal(undefined);
            done();
        });

        it('should handle Ad Skip', function(done) {
            mParticle.forwarder.process({
                AdContent: {
                    id: '4423210',
                    advertiser: 'Moms Friendly Robot Company',
                    title: 'What?! Nobody rips off my kids but me!',
                    campaign: 'MomCorp Galactic Domination Plot 3201',
                    duration: 60000,
                    creative: 'A Fishful of Dollars',
                    siteid: 'moms',
                    placement: 2
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.AdSkip
            });

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalled.should.equal(
                true
            );

            window.mParticle.forwarder.common.mediaHeartbeat.trackEventCalledWith.eventName.should.equal(
                'adSkip'
            );

            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackEventCalledWith.eventObject
            ).equal(undefined);

            done();
        });
    });
    describe('Custom MetaData', () => {
        it('should pass custom attributes to #trackSessionStart', () => {
            mParticle.forwarder.process({
                EventAttributes: {
                    someCustomData: 'foo'
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.SessionStart
            });
            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackSessionStartCalledWith.customVideoMeta
            ).match({ someCustomData: 'foo' });
        });
        it('should pass custom attributes to #trackEvent', () => {
            mParticle.forwarder.process({
                AdContent: {
                    id: '4423210',
                    advertiser: 'Moms Friendly Robot Company',
                    title: 'What?! Nobody rips off my kids but me!',
                    campaign: 'MomCorp Galactic Domination Plot 3201',
                    duration: 60000,
                    creative: 'A Fishful of Dollars',
                    siteid: 'moms',
                    placement: 2
                },
                EventAttributes: {
                    someCustomData: 'foo'
                },
                EventDataType: MessageTypes.Media,
                EventCategory: MediaEventType.AdSkip
            });
            should(
                window.mParticle.forwarder.common.mediaHeartbeat
                    .trackEventCalledWith.customMetaData
            ).match({ someCustomData: 'foo' });
        });
    });
});
