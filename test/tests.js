///tests Navigation




/* eslint-disable no-undef*/
describe('AdobeEventForwarder Forwarder', function () {
    var expandCommerceEvent = function(event) {
            return [{
                EventName: event.EventName,
                EventDataType: event.EventDataType,
                EventAttributes: event.EventAttributes
            }];
        },
        MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            Commerce: 16
        },
        EventType = {
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
        ReportingService = function () {
            var self = this;

            this.id = null;
            this.event = null;

            this.cb = function (forwarder, event) {
                self.id = forwarder.id;
                self.event = event;
            };

            this.reset = function () {
                this.id = null;
                this.event = null;
            };
        },
        reportService = new ReportingService(),

        Visitor = {
            AuthState: {
                AUTHENTICATED: 1,
                LOGGED_OUT: 2,
                UNKNOWN: 0
            }
        },

        MockAdobeForwarder = function() {
            var self = this;

            this.products = null;
            this.events = null;
            this.contextData = {};

            this.trackCustomEventCalled = false;
            this.logPurchaseEventCalled = false;
            this.initializeCalled = false;

            this.trackCustomName = null;
            this.logPurchaseName = null;
            this.apiKey = null;
            this.appId = null;
            this.userId = null;
            this.userAttributes = {};
            this.userIdField = null;

            this.eventProperties = [];
            this.purchaseEventProperties = [];

            this.setUserId = function(id) {
                self.userId = id;
            };

            this.visitor = {
                setCustomerIDs: function(userIdObject) {
                    self.userId = userIdObject;
                }
            };

            this.setUserAttributes = function(attributeDict) {
                for (var key in attributeDict) {
                    if (attributeDict[key] === null) {
                        delete self.userAttributes[key];
                    }
                    else {
                        self.userAttributes[key] = attributeDict[key];
                    }
                }
            };
        };

    before(function () {
        window.Visitor = Visitor;
        mParticle.EventType = EventType;
        mParticle.ProductActionType = ProductActionType;
        mParticle.PromotionType = PromotionActionType;
        mParticle.IdentityType = IdentityType;
        mParticle.CommerceEventType = CommerceEventType;
        mParticle.eCommerce = {};
        mParticle.eCommerce.expandCommerceEvent = expandCommerceEvent;
    });

    beforeEach(function() {
        window.s = new MockAdobeForwarder();
        mParticle.forwarder.init({
            productIncrementor:'[{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;event2&quot;,&quot;map&quot;:&quot;Name&quot;,&quot;jsmap&quot;:&quot;3373707&quot;}]',
            commerceEventsAsTrackState:'[{&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;8546102375969542712&quot;,&quot;map&quot;:null}]',
            productMerchandising:'[{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;eVar2&quot;,&quot;map&quot;:&quot;Category&quot;,&quot;jsmap&quot;:&quot;50511102&quot;},{&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;eVar3&quot;,&quot;map&quot;:&quot;Id&quot;,&quot;jsmap&quot;:&quot;3355&quot;}]',
            hvars:'[{&quot;maptype&quot;:&quot;EventAttributeClassDetails.ScreenView.Id&quot;,&quot;value&quot;:&quot;hier1&quot;,&quot;map&quot;:&quot;2361242877491637581&quot;,&quot;jsmap&quot;:&quot;-1095764254&quot;}]',
            evars:'[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;eVar1&quot;,&quot;map&quot;:&quot;color&quot;}]',
            props:'[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop1&quot;,&quot;map&quot;:&quot;gender&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop2&quot;,&quot;map&quot;:&quot;Navigation&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop3&quot;,&quot;map&quot;:&quot;color&quot;},{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop4&quot;,&quot;map&quot;:&quot;button_number&quot;},{&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;prop5&quot;,&quot;map&quot;:&quot;joetest&quot;}]',
            events:'[{&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;event1&quot;,&quot;map&quot;:&quot;8546102375969542712&quot;,&quot;jsmap&quot;:&quot;-472683102&quot;}]',
            contextVariables:'[{&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;contextTestValue&quot;,&quot;map&quot;:&quot;color&quot;}]',
            reportSuiteID: '123456',
            marketingCloudID: 'abcde',
            trackingServerURL: 'customerId',
            trackingServerURLSecure: 'customerId'
        }, reportService.cb, true, null, {
            gender: 'm'
        }, [{
            Identity: 'customerId',
            Type: IdentityType.CustomerId
        }, {
            Identity: 'email',
            Type: IdentityType.Email
        }, {
            Identity: 'facebook',
            Type: IdentityType.Facebook
        }], '1.1', 'My App');
    });

    // Mappings
    // evarsmapping:
    // {color: "eVar1"}
    //
    // propsMapping
    // {gender: "prop1", Navigation: "prop2", color: "prop3", button_number: "prop4", joetest: "prop5"}
    //
    // trackStateMapping
    // {null: "8546102375969542712"}
    //
    // productIncrementorMapping
    // {Name: "event2"}
    //
    // productMerchandisingMapping
    // {Category: "eVar2", Id: "eVar3"}
    //
    // contextVariableMapping
    // {color: "contextTestValue"}
    //
    // eventsMapping
    // {8546102375969542712: "event1"}
    //
    // hiersMapping
    // {2361242877491637581: "hier1"}

    it('should set the customerId', function(done) {
        mParticle.forwarder.setUserIdentity('1234', IdentityType.CustomerId, window.s);
        s.userId.userId.id.should.equal('1234');
        s.userId.userId.authState.should.equal(0);

        done();
    });

    //TODO: mappings will change, tests will need to be updated
    it('should log page view', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageView,
            EventName: 'log page view test',
            EventAttributes: {
                color: 'green',
                gender: 'female',
                //hier
                '2361242877491637581': 'test'
            }
        });
        s.pageName.should.equal('log page view test');
        s.events.should.equal('log page view test');
        s.eVar1.should.equal('green');
        s.prop1.should.equal('female');
        s.hier1.should.equal('test');
        s.contextData.contextTestValue.should.equal('green');

        done();
    });
});
