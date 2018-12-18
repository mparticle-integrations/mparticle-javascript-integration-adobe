/* eslint-disable no-undef*/
describe('AdobeServerSide Forwarder', function () {
    var MockVisitorInstance = function() {
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
    };

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
    },

    before(function () {
        window.Visitor = Visitor;
    });

    beforeEach(function() {
        window.s = null;
        window.mockInstances = {};
        window.mParticleAndroid = null;
        window.mParticle.isIOS = null;
        window.mParticle.useCookieStorage = false;
        mParticle.isDevelopmentMode = false;
        mParticle.eCommerce.Cart.clear();
        mParticle.configureForwarder({
            name: 'Adobe',
            settings: {
                productIncrementor:'[{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;event2&quot;,&quot;map&quot;:&quot;PI1&quot;,&quot;jsmap&quot;:&quot;3373707&quot;},{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;event6&quot;,&quot;map&quot;:&quot;PI2&quot;,&quot;jsmap&quot;:&quot;3373707&quot;}]',
                commerceEventsAsTrackState:'[{&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;8546102375969542712&quot;,&quot;map&quot;:null}]',
                productMerchandising:'[{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;eVar2&quot;,&quot;map&quot;:&quot;PM1&quot;,&quot;jsmap&quot;:&quot;50511102&quot;},{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;eVar3&quot;,&quot;map&quot;:&quot;PM2&quot;,&quot;jsmap&quot;:&quot;3355&quot;}]',
                hvars:'[{&quot;maptype&quot;:&quot;EventAttributeClassDetails.ScreenView.Id&quot;,&quot;value&quot;:&quot;hier1&quot;,&quot;map&quot;:&quot;2361242877491637581&quot;,&quot;jsmap&quot;:&quot;-1095764254&quot;},{&quot;maptype&quot;:&quot;EventAttributeClassDetails.ScreenView.Id&quot;,&quot;value&quot;:&quot;hier2&quot;,&quot;map&quot;:&quot;2907988680309444828&quot;,&quot;jsmap&quot;:&quot;-498368463&quot;}]',
                evars:'[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;eVar1&quot;,&quot;map&quot;:&quot;color&quot;}]',
                props:'[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop2&quot;,&quot;map&quot;:&quot;gender&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop2&quot;,&quot;map&quot;:&quot;Navigation&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop3&quot;,&quot;map&quot;:&quot;color&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop4&quot;,&quot;map&quot;:&quot;button_number&quot;},{&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop5&quot;,&quot;map&quot;:&quot;joetest&quot;}]',
                events:'[{&quot;maptype&quot;:&quot;EventClassDetails.Id&quot;,&quot;value&quot;:&quot;event1&quot;,&quot;map&quot;:&quot;1821516884252957430&quot;,&quot;jsmap&quot;:&quot;750057686&quot;},{&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;event2&quot;,&quot;map&quot;:&quot;-3234618101041058100&quot;,&quot;jsmap&quot;:&quot;-1107730368&quot;},{&quot;maptype&quot;:&quot;EventClassDetails.Id&quot;,&quot;value&quot;:&quot;event3&quot;,&quot;map&quot;:&quot;-5153013487206524777&quot;,&quot;jsmap&quot;:&quot;564473837&quot;},{&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;event7&quot;,&quot;map&quot;:&quot;discount&quot;,&quot;jsmap&quot;:&quot;-100343221&quot;}]',
                contextVariables:'[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;contextTestValue&quot;,&quot;map&quot;:&quot;c1&quot;}]',
                organizationID: 'abcde',
                trackingServerURL: 'customerId',
                trackingServerURLSecure: 'customerId',
                timestampOption: 'notallowed',
                reportSuiteIDs: 'testReportSuiteId',
                setGlobalObject: 'True'
            },
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
        });
        mParticle.init('apikey');
    });

    it('should call setIntegrationAttribute properly', function(done) {
        mParticle.getIntegrationAttributes(124).mid.should.equal('MCID test');
        mParticle._getIntegrationDelays()[124].should.equal(false);

        done();
    });
});
