/* eslint-disable no-undef*/
var server = new MockHttpServer;

describe('AdobeEventForwarder Forwarder', function () {
    var EventType = {
            Unknown: 0,
            Navigation: 1,
            Location: 2,
            Search: 3,
            Transaction: 4,
            UserContent: 5,
            UserPreference: 6,
            Social: 7,
            Other: 8,
            Media: 9,
            ProductPurchase: 16,
            getName: function () {
                return 'blahblah';
            }
        },
        CommerceEventType = {
            ProductAddToCart: 10,
            ProductRemoveFromCart: 11,
            ProductCheckout: 12,
            ProductCheckoutOption: 13,
            ProductClick: 14,
            ProductViewDetail: 15,
            ProductPurchase: 16,
            ProductRefund: 17,
            PromotionView: 18,
            PromotionClick: 19,
            ProductAddToWishlist: 20,
            ProductRemoveFromWishlist: 21,
            ProductImpression: 22
        },
        ProductActionType = {
            Unknown: 0,
            AddToCart: 1,
            RemoveFromCart: 2,
            Checkout: 3,
            CheckoutOption: 4,
            Click: 5,
            ViewDetail: 6,
            Purchase: 7,
            Refund: 8,
            AddToWishlist: 9,
            RemoveFromWishlist: 10
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
            getName: function () {return 'CustomerID';}
        },
        PromotionActionType = {
            Unknown: 0,
            PromotionView: 1,
            PromotionClick: 2
        },

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
            },
            AuthState: {
                AUTHENTICATED: 1,
                LOGGED_OUT: 2,
                UNKNOWN: 0
            }
        },

        MockAppMeasurement= function() {
            var self = this;

            this.products = null;
            this.events = null;
            this.contextData = {};
            this.tCalled = false;
            this.tlCalled = false;
            this.trackCustomEventCalled = false;
            this.logPurchaseEventCalled = false;
            this.initializeCalled = false;

            this.t = function() {
                self.tCalled = true;
            };

            this.tl = function() {
                self.tlCalled = true;
            };

            this.clearVarsCalled = false;

            this.clearVars = function() {
                //only call clearVars after s.t() is called
                if (self.tCalled || self.tlCalled) {
                    self.clearVarsCalled = true;
                }
            };
        };

    function configureAdobeForwarderAndReInit(timestampOption, setGlobalObject, enablePageNameBoolean) {
        mParticle.config = {
            requestConfig: false,
            logLevel: 'none',
            workspaceToken: 'testworkspacetoken',
            kitConfigs: [
                {
                    name: 'Adobe',
                    settings: {
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
                        timestampOption: timestampOption,
                        reportSuiteIDs: 'testReportSuiteId',
                        setGlobalObject: setGlobalObject,
                        enablePageName: enablePageNameBoolean || false
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
                }
            ]
        };
        mParticle.init('apikey', mParticle.config);
    }

    window.s_gi = function(reportSuiteID) {
        if (!window.mockInstances.hasOwnProperty(reportSuiteID)) {
            window.mockInstances[reportSuiteID] = new MockAppMeasurement;
        }
        return window.mockInstances[reportSuiteID];
    };

    beforeAll(function () {
        server.start();
        server.requests = [];
        server.handle = function(request) {
            request.setResponseHeader('Content-Type', 'application/json');
            request.receive(200, JSON.stringify({
                Store: {},
                mpid: 'testMPID'
            }));
        };
        window.Visitor = Visitor;
        mParticle.EventType = EventType;
        mParticle.ProductActionType = ProductActionType;
        mParticle.PromotionType = PromotionActionType;
        mParticle.IdentityType = IdentityType;
        mParticle.CommerceEventType = CommerceEventType;
        mParticle.generateHash = function (name) {
            var hash = 0,
                i = 0,
                character;

            if (!name) {
                return null;
            }

            name = name.toString().toLowerCase();

            if (Array.prototype.reduce) {
                return name.split('').reduce(function(a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
            }

            if (name.length === 0) {
                return hash;
            }

            for (i = 0; i < name.length; i++) {
                character = name.charCodeAt(i);
                hash = ((hash << 5) - hash) + character;
                hash = hash & hash;
            }
            return hash;
        };
    });

    beforeEach(function() {
        window.s = null;
        window.mockInstances = {};
        server.requests = [];
        window.mParticleAndroid = null;
        window.mParticle.isIOS = null;
        window.mParticle.useCookieStorage = false;
        mParticle.isDevelopmentMode = false;
        configureAdobeForwarderAndReInit('optional');
        mParticle.eCommerce.Cart.clear();
    });

    test('should initialize properly', function(done) {
        configureAdobeForwarderAndReInit('notallowed');
        expect(s_gi('testReportSuiteId')).toBeDefined();
        expect(s_gi('testReportSuiteId').visitor).toBeDefined();
        expect(s_gi('testReportSuiteId').visitor.orgId).toBe('abcde');
        expect(s_gi('testReportSuiteId').trackingServer).toBe('trackingServer.com');
        
        expect(window.s).toBeFalsy();
        expect(window.appMeasurement).toBeFalsy();

        configureAdobeForwarderAndReInit('notallowed', 'True');
        expect(s_gi('testReportSuiteId')).toBeDefined();
        expect(s_gi('testReportSuiteId').visitor).toBeDefined();
        expect(s_gi('testReportSuiteId').visitor.orgId).toBe('abcde');

        expect(window.s).toBeDefined();

        done();
    });

    test('should set the customerId properly', function(done) {
        var appMeasurementInstance = s_gi('testReportSuiteId');
        mParticle.Identity.login({ userIdentities: { customerid: '123' } }, function() { return; });
        expect(appMeasurementInstance.visitor.userId.customerid.id).toBe('123');
        
        mParticle.Identity.modify({userIdentities: {customerid: '234', email: 'test@gmail.com'}});
        expect(appMeasurementInstance.visitor.userId.customerid.id).toBe('234');
        expect(appMeasurementInstance.visitor.userId.email.id).toBe('test@gmail.com');

        server.handle = function(request) {
            request.setResponseHeader('Content-Type', 'application/json');
            request.receive(200, JSON.stringify({
                Store: {},
                mpid: 'loggedOut'
            }));
        };

        mParticle.Identity.logout();
        expect(appMeasurementInstance.visitor.userId.customerid).toBeFalsy();
        expect(appMeasurementInstance.visitor.userId.email).toBeFalsy();

        done();
    });

    test('should set the timestamp when timestamp === \'optional\' or \'required\' and not set it when it is \'notallowed\'', function(done) {
        configureAdobeForwarderAndReInit('optional');
        var appMeasurementInstance = s_gi('testReportSuiteId');
        mParticle.logEvent('Button 1', EventType.Navigation);
        expect(appMeasurementInstance.timestamp).toBeDefined();

        appMeasurementInstance.timestamp = null;

        configureAdobeForwarderAndReInit('notallowed');

        mParticle.logEvent('Button 1', EventType.Navigation);
        expect(appMeasurementInstance.timestamp).toBeFalsy();

        configureAdobeForwarderAndReInit('required');

        mParticle.logEvent('Button 1', EventType.Navigation);
        expect(appMeasurementInstance.timestamp).toBeDefined();

        done();
    });

    test('should log page view', function(done) {
        mParticle.logPageView('log page view test', {color: 'green', gender: 'female', c1: 'c1testValue', linkName: 'test'});

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.pageName).toBe('log page view test');
        expect(appMeasurementInstance.eVar1).toBe('green');
        expect(appMeasurementInstance.prop2).toBe('female');
        expect(appMeasurementInstance.hier1).toBe('test');
        expect(appMeasurementInstance.contextData.contextTestValue).toBe('c1testValue');
        expect(appMeasurementInstance.tCalled).toBe(true);
        expect(appMeasurementInstance.tlCalled).toBe(false);
        expect(appMeasurementInstance.clearVarsCalled).toBe(true);

        done();
    });

    test('should log an event when trying to log a mapped page view value', function(done) {
        mParticle.logPageView('Find Ticket', {color: 'green', gender: 'female', c1: 'c1testValue', linkName: 'test'});

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.pageName).toBe('Find Ticket');
        expect(appMeasurementInstance.events).toBe('event1');
        expect(appMeasurementInstance.eVar1).toBe('green');
        expect(appMeasurementInstance.prop2).toBe('female');
        expect(appMeasurementInstance.hier1).toBe('test');
        expect(appMeasurementInstance.contextData.contextTestValue).toBe('c1testValue');
        expect(appMeasurementInstance.tlCalled).toBe(true);
        expect(appMeasurementInstance.tCalled).toBe(false);
        expect(appMeasurementInstance.clearVarsCalled).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('eVar1') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('prop2') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('prop3') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('hier1') >= 0).toBe(true);
        expect(
            appMeasurementInstance.linkTrackVars.indexOf('contextData.contextTestValue') >= 0
        ).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('events') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('events') >= 0).toBe(true);

        done();
    });

    test('should log an event with pageName when enabledPageName is True', function(done) {
        configureAdobeForwarderAndReInit('optional', 'False', 'True');
        mParticle.logPageView('Find Ticket', {color: 'green', gender: 'female', c1: 'c1testValue', linkName: 'test'});

        var appMeasurementInstance = s_gi('testReportSuiteId');

        expect(appMeasurementInstance.linkTrackVars.indexOf('pageName') >= 0).toBe(true);

        done();
    });

    test('should not log event that is not mapped', function(done) {
        mParticle.logEvent('blah', mParticle.EventType.Unknown, {color: 'green', gender: 'female', c1: 'c1testValue', linkName: 'test'});

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.tlCalled).toBe(false);
        expect(appMeasurementInstance.tCalled).toBe(false);
        expect(appMeasurementInstance.pageName).toBeFalsy();
        expect(appMeasurementInstance.events).toBeFalsy();
        expect(appMeasurementInstance.eVar1).toBeFalsy();
        expect(appMeasurementInstance.prop2).toBeFalsy();
        expect(appMeasurementInstance.hier1).toBeFalsy();
        expect(Object.keys(appMeasurementInstance.contextData).length).toBe(0);
        expect(appMeasurementInstance.clearVarsCalled).toBe(false);

        expect(appMeasurementInstance.linkTrackVars).toBe('None');

        done();
    });

    test('should log a product purchase with proper events, product merchandising events, and produdt incrementor events', function(done) {
        var product1 = mParticle.eCommerce.createProduct('nokia', '1234', 123, 1, null, null, null, null, null, {PI1: 'bob', PI2: 'tim', PM1: 'sneakers', PM2: 'shirt'});
        var product2 = mParticle.eCommerce.createProduct('apple', '2345', 234, 2, null, null, null, null, null, {PI1: 'Jones', PM2: 'abc', availability: true});
        var ta = mParticle.eCommerce.createTransactionAttributes('tID123', 'aff1', 'coupon', 456, 10, 5);

        mParticle.eCommerce.logPurchase(ta, [product1, product2], true, {gender: 'male', color: 'blue', discount: 20});

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.products).toBe(
            ';nokia;1234;1;123;event2=bob|event6=tim;eVar2=sneakers|eVar3=shirt,;apple;2345;2;234;event2=Jones;eVar3=abc'
        );
        expect(appMeasurementInstance.events).toBe('purchase,event7=20,event2,event6');
        expect(appMeasurementInstance.purchaseID).toBe('tID123');
        expect(appMeasurementInstance.prop2).toBe('male');
        expect(appMeasurementInstance.prop3).toBe('blue');
        expect(appMeasurementInstance.eVar1).toBe('blue');
        expect(appMeasurementInstance.tlCalled).toBe(true);
        expect(appMeasurementInstance.tCalled).toBe(false);
        expect(appMeasurementInstance.clearVarsCalled).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('events') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('products') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('prop2') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('prop3') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('eVar1') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('transactionID') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('purchaseID') >= 0).toBe(true);

        done();
    });

    test('should log a product purchase wih pageName when enabledPageName is True', function(done) {
        configureAdobeForwarderAndReInit('optional', 'True', 'True');

        var product1 = mParticle.eCommerce.createProduct('nokia', '1234', 123, 1, null, null, null, null, null, {PI1: 'bob', PI2: 'tim', PM1: 'sneakers', PM2: 'shirt'});
        var product2 = mParticle.eCommerce.createProduct('apple', '2345', 234, 2, null, null, null, null, null, {PI1: 'Jones', PM2: 'abc', availability: true});
        var ta = mParticle.eCommerce.createTransactionAttributes('tID123', 'aff1', 'coupon', 456, 10, 5);

        mParticle.eCommerce.logPurchase(ta, [product1, product2], true, {gender: 'male', color: 'blue', discount: 20});

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.linkTrackVars.indexOf('pageName') >= 0).toBe(true);

        done();
    });

    test('should log a product add to cart', function(done) {
        var product1 = mParticle.eCommerce.createProduct('nokia', '1234', 123, 1, null, null, null, null, null, {PI1: 'bob', PI2: 'tim', PM1: 'sneakers', PM2: 'shirt'});
        var product2 = mParticle.eCommerce.createProduct('apple', '2345', 234, 2, null, null, null, null, null, {PI1: 'Jones', PM2: 'abc', availability: true});
        mParticle.eCommerce.Cart.add([product1, product2], true);

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.products).toBe(
            ';nokia;1234;1;123;event2=bob|event6=tim;eVar2=sneakers|eVar3=shirt,;apple;2345;2;234;event2=Jones;eVar3=abc'
        );
        expect(appMeasurementInstance.events).toBe('scAdd,event2,event6');
        expect(appMeasurementInstance.tlCalled).toBe(true);
        expect(appMeasurementInstance.tCalled).toBe(false);
        expect(appMeasurementInstance.clearVarsCalled).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('events') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('products') >= 0).toBe(true);

        done();
    });

    test('should log a product remove from cart', function(done) {
        var product1 = mParticle.eCommerce.createProduct('nokia', '1234', 123, 1, null, null, null, null, null, {PI1: 'bob', PI2: 'tim', PM1: 'sneakers', PM2: 'shirt'});
        var product2 = mParticle.eCommerce.createProduct('apple', '2345', 234, 2, null, null, null, null, null, {PI1: 'Jones', PM2: 'abc', availability: true});
        mParticle.eCommerce.Cart.add([product1, product2], true);

        mParticle.eCommerce.Cart.remove(product1, true);

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.products).toBe(';nokia;1234;1;123;event2=bob|event6=tim;eVar2=sneakers|eVar3=shirt');
        expect(appMeasurementInstance.events).toBe('scRemove,event2,event6');
        expect(appMeasurementInstance.tlCalled).toBe(true);
        expect(appMeasurementInstance.tCalled).toBe(false);
        expect(appMeasurementInstance.clearVarsCalled).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('events') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('products') >= 0).toBe(true);

        done();
    });

    test('should log a product view', function(done) {
        var product1 = mParticle.eCommerce.createProduct('nokia', '1234', 123, 1, null, null, null, null, null, {PI1: 'bob', PI2: 'tim', PM1: 'sneakers', PM2: 'shirt'});
        mParticle.eCommerce.logProductAction(ProductActionType.ViewDetail, product1, {gender: 'male', color: 'blue'});

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.products).toBe(';nokia;1234;1;123;event2=bob|event6=tim;eVar2=sneakers|eVar3=shirt');
        expect(appMeasurementInstance.events).toBe('prodView,event2,event6');
        expect(appMeasurementInstance.prop2).toBe('male');
        expect(appMeasurementInstance.prop3).toBe('blue');
        expect(appMeasurementInstance.eVar1).toBe('blue');
        expect(appMeasurementInstance.tlCalled).toBe(true);
        expect(appMeasurementInstance.tCalled).toBe(false);
        expect(appMeasurementInstance.clearVarsCalled).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('events') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('products') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('prop2') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('prop3') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('eVar1') >= 0).toBe(true);

        done();
    });

    test('should log a product checkout', function(done) {
        var product1 = mParticle.eCommerce.createProduct('nokia', '1234', 123, 1, null, null, null, null, null, {PI1: 'bob', PI2: 'tim', PM1: 'sneakers', PM2: 'shirt'});
        var product2 = mParticle.eCommerce.createProduct('apple', '2345', 234, 2, null, null, null, null, null, {PI1: 'Jones', PM2: 'abc', availability: true});
        mParticle.eCommerce.Cart.add([product1, product2]);

        mParticle.eCommerce.logCheckout(1, {}, {gender: 'male', color: 'blue'});

        var appMeasurementInstance = s_gi('testReportSuiteId');
        expect(appMeasurementInstance.products).toBe(
            ';nokia;1234;1;123;event2=bob|event6=tim;eVar2=sneakers|eVar3=shirt,;apple;2345;2;234;event2=Jones;eVar3=abc'
        );
        expect(appMeasurementInstance.events).toBe('scCheckout,event2,event6');
        expect(appMeasurementInstance.prop2).toBe('male');
        expect(appMeasurementInstance.prop3).toBe('blue');
        expect(appMeasurementInstance.eVar1).toBe('blue');
        expect(appMeasurementInstance.tlCalled).toBe(true);
        expect(appMeasurementInstance.tCalled).toBe(false);
        expect(appMeasurementInstance.clearVarsCalled).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('events') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('products') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('prop2') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('prop3') >= 0).toBe(true);
        expect(appMeasurementInstance.linkTrackVars.indexOf('eVar1') >= 0).toBe(true);

        done();
    });

    test('should call setIntegrationAttribute properly', function(done) {
        expect(mParticle.getIntegrationAttributes(124).mid).toBe('MCID test');
        expect(mParticle._getIntegrationDelays()[124]).toBe(false);

        done();
    });
});
