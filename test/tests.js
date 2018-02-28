/* eslint-disable no-undef*/
describe('ClientSdk Forwarder', function () {
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

        // This is the object that mocks your SDK. each method that is called from the SDK
        // should be stubbed here. ie. clientSDK.logEvent(event) should be stubbed below as
        //  MockClientSdk = function() {
        //      var self = this;
        //      this.logEventCalled = null;
        //      this.eventLogged = null;
        //      this.logEvent = function(event) {
        //          self.logEventCalled = true;
        //          self.eventLogged = event;
        //      };
        // }
        // You can then test for values on  window.clientSdk.eventLogged and window.clientSdk.logEventCalled;
        MockClientSdk = function() {
            var self = this;

            this.logPurchaseEventCalled = false;
            this.initializeCalled = false;

            this.eventLogged = null;
            this.logEventCalled = null;
        };

    before(function () {
        var mp = function () {
            var self = this;

            this.addForwarder = function (forwarder) {
                self.forwarder = new forwarder.constructor();
            };

            this.getCurrentUser = function() {
                return currentUser();
            };
        };

        window.mParticle = new mp();

        mParticle.EventType = EventType;
        mParticle.ProductActionType = ProductActionType;
        mParticle.PromotionType = PromotionActionType;
        mParticle.IdentityType = IdentityType;
        mParticle.CommerceEventType = CommerceEventType;
        mParticle.eCommerce = {};
        mParticle.eCommerce.expandCommerceEvent = expandCommerceEvent;
    });

    beforeEach(function() {
        window.clientSdk = new MockSdk();
        // your kit is initialized here
        mParticle.forwarder.init({
            clientKey: '123456',
            appId: 'abcde'
        }, reportService.cb, true, null, {
            userAttr1: 'value1',
            userAttr2: 'value2'
        }, [{
            Identity: 'customerId',
            Type: IdentityType.CustomerId
        }, {
            Identity: 'email@emailco.com',
            Type: IdentityType.Email
        }, {
            Identity: 'facebookId',
            Type: IdentityType.Facebook
        }], '1.1', 'My App');
    });

    // Example log event testing
    it('should log event', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event',
            EventAttributes: {
                label: 'label',
                value: 200,
                category: 'category'
            }
        });
        window.clientSdk.apiKey.should.equal('123456');
        window.clientSdk.appId.should.equal('abcde');
        window.clientSdk.eventProperties[0].category.should.equal('category');
        window.clientSdk.eventProperties[0].label.should.equal('label');
        window.clientSdk.eventProperties[0].value.should.equal(200);

        done();
    });

    // Remaining tests are below. Remove and add as needed
    it('should log page view', function(done) {
        done();
    });

    it('should log a product purchase commerce event', function(done) {
        done();
    });

    it('should set user attributes', function(done) {
        done();
    });

    it('should remove user attributes', function(done) {
        done();
    });
});
