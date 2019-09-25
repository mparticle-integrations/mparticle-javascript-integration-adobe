/* eslint-disable no-undef*/
describe('AdobeServerSide Forwarder', function () {
    window.mParticle.isTestEnvironment = true;

    var server = new MockHttpServer(),
        MockVisitorInstance = function() {
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
        this.trackPlay = function () {
            window.trackPlayCalled = true;
            return true;
        };
    };
    
    var MockMediaHeartbeatConfig = function () { };
    var MockMediaHeartbeatDelegate = function () { };
    var settings = require('./settings.json');

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
