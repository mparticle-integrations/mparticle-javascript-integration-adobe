// START OF ADOBE MPARTICLE JS INTEGRATION

/* eslint-disable no-undef */

//
//  Copyright 2018 mParticle, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the 'License');
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an 'AS IS' BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

(function (window) {
    var name = 'Adobe',
        MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            Commerce: 16
        };

    var constructor = function () {
        var self = this,
            settings,
            timestampOption,
            isInitialized = false,
            reportingService,
            contextVariableMapping,
            productIncrementorMapping,
            productMerchandisingMapping,
            propsMapping,
            eVarsMapping,
            hiersMapping,
            eventsMapping;

        self.name = name;

        function initForwarder(forwarderSettings, service) {
            settings = forwarderSettings;
            reportingService = service;
            try {
                loadMappings();
                timestampOption = (settings.timestampOption === 'optional' || settings.timestampOption === 'required');
                finishAdobeInitialization();
                isInitialized = true;

                return 'ClientSDK successfully loaded';
            } catch (e) {
                return 'Failed to initialize: ' + e;
            }
        }

        function loadMappings() {
            eVarsMapping = settings.evars ? JSON.parse(settings.evars.replace(/&quot;/g, '\"')) : [];
            propsMapping = settings.props ? JSON.parse(settings.props.replace(/&quot;/g, '\"')) : [];
            productIncrementorMapping = settings.productIncrementor ? JSON.parse(settings.productIncrementor.replace(/&quot;/g, '\"')) : [];
            productMerchandisingMapping = settings.productMerchandising ? JSON.parse(settings.productMerchandising.replace(/&quot;/g, '\"')) : [];
            hiersMapping = settings.hvars ? JSON.parse(settings.hvars.replace(/&quot;/g, '\"')) : [];
            eventsMapping = settings.events ? JSON.parse(settings.events.replace(/&quot;/g, '\"')) : [];
            contextVariableMapping = settings.contextVariables ? JSON.parse(settings.contextVariables.replace(/&quot;/g, '\"')) : [];
        }

        function finishAdobeInitialization() {
            try {
                s=s_gi(settings.reportSuiteIDs);
                s.visitor = Visitor.getInstance(settings.organizationID);

                s.trackingServer = settings.trackingServerURL;
                s.trackingServerSecure = settings.trackingServerURLSecure;
                s.trackDownloadLinks = true;
                s.trackExternalLinks = true;
                s.trackInlineStats = true;
                s.linkDownloadFileTypes = 'exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx';
                s.linkInternalFilters = 'javascript:';
                s.linkLeaveQueryString = false;
                s.linkTrackVars = 'None';
                s.linkTrackEvents = 'None';
                s.visitorNamespace = '';
                return true;
            } catch(e) {
                return 'error initializing adobe: ' + e;
            }
        }

        // Get the mapped value for custom events
        function getEventMappingValue(event) {
            var jsHash = calculateJSHash(event.EventDataType, event.EventCategory, event.EventName);
            return findValueInMapping(jsHash, eventsMapping);
        }

        function calculateJSHash(eventDataType, eventCategory, name) {
            var preHash =
                ('' + eventDataType) +
                ('' + eventCategory) + '' +
                (name || '');

            return mParticle.generateHash(preHash);
        }

        function findValueInMapping(jsHash, mapping) {
            if (mapping) {
                var filteredArray = mapping.filter(function(mappingEntry) {
                    if (mappingEntry.jsmap && mappingEntry.maptype && mappingEntry.value) {
                        return mappingEntry.jsmap === jsHash.toString();
                    }

                    return {
                        result: false
                    };
                });

                if (filteredArray && filteredArray.length > 0) {
                    return {
                        result: true,
                        matches: filteredArray
                    };
                }
            }
            return null;
        }

        // for each type of event, we run setMappings which sets the eVars, props, hvars, and contextData values
        // after each event is sent to the server (either using s.t() for pageViews or s.tl() for non-pageview events), s.clearVars() is run to wipe out
        // any eVars, props, and hvars
        function processEvent(event) {
            var reportEvent = false;
            var linkTrackVars = [];
            s.timestamp = timestampOption ? Math.floor((new Date).getTime()/1000) : null;
            s.events = '';

            if (isInitialized) {
                try {
                    // First determine if an eventName is mapped, if so, log it as an event as opposed to a pageview or commerceview
                    // ex. If a pageview is mapped to an event, we logEvent instead of logging it as a pageview
                    var eventMapping = getEventMappingValue(event);

                    if (eventMapping && eventMapping.result && eventMapping.matches) {
                        setMappings(event, true, linkTrackVars);
                        reportEvent = logEvent(event, linkTrackVars, eventMapping.matches);
                    }
                    else if (event.EventDataType === MessageType.PageView) {
                        setMappings(event, false);
                        reportEvent = logPageView(event);
                    }
                    else if (event.EventDataType === MessageType.Commerce) {
                        setMappings(event, true, linkTrackVars);
                        reportEvent = processCommerceTransaction(event, linkTrackVars);
                    }
                    else {
                        return 'event name not mapped, aborting event logging';
                    }

                    if (reportEvent === true && reportingService) {
                        reportingService(self, event);
                        return 'Successfully sent to ' + name;
                    }
                    else {
                        return 'Error logging event or event type not supported - ' + reportEvent.error;
                    }
                }
                catch (e) {
                    return 'Failed to send to: ' + name + ' ' + e;
                }
            }

            return 'Can\'t send to forwarder ' + name + ', not initialized.';
        }

        function setMappings(event, includeTrackVars, linkTrackVars) {
            if (includeTrackVars) {
                setEvars(event, linkTrackVars);
                setProps(event, linkTrackVars);
                setHiers(event, linkTrackVars);
                setContextData(event, linkTrackVars);
            } else {
                setEvars(event);
                setProps(event);
                setHiers(event);
                setContextData(event);
            }
        }

        function processCommerceTransaction(event, linkTrackVars) {
            if (event.EventCategory === mParticle.CommerceEventType.ProductPurchase) {
                s.events='purchase';
                s.purchaseID = event.ProductAction.TransactionId;
                s.transactionID = event.ProductAction.TransactionId;
                linkTrackVars.push('purchaseID', 'transactionID');
            } else if (event.EventCategory === mParticle.CommerceEventType.ProductViewDetail) {
                s.events='prodView';
            } else if (event.EventCategory === mParticle.CommerceEventType.ProductAddToCart) {
                s.events='scAdd';
            } else if (event.EventCategory === mParticle.CommerceEventType.ProductRemoveFromCart) {
                s.events='scRemove';
            } else if (event.EventCategory === mParticle.CommerceEventType.ProductCheckout) {
                s.events='scCheckout';
            }
            s.linkTrackEvents = s.events || null;
            processProductsAndSetEvents(event, linkTrackVars);
            s.pageName = event.EventName || window.document.title;
            linkTrackVars.push('products', 'events', 'pageName');
            s.linkTrackVars = linkTrackVars;
            s.tl(true, 'o', event.EventName);

            s.clearVars();

            return true;
        }

        function processProductsAndSetEvents(event) {
            try {
                var productDetails,
                    incrementor,
                    merchandising,
                    productBuilder,
                    allProducts = [];

                var expandedEvents = mParticle.eCommerce.expandCommerceEvent(event);
                expandedEvents.forEach(function(expandedEvt) {
                    productBuilder = [];
                    productDetails = [];
                    incrementor = [];
                    merchandising = [];

                    if (expandedEvt.EventName === 'eCommerce - Purchase - Total') {
                        for (var eventAttributeKey in expandedEvt.EventAttributes) {
                            if (expandedEvt.EventAttributes.hasOwnProperty(eventAttributeKey)) {
                                var jsHash = calculateJSHash(event.EventDataType, event.EventCategory, eventAttributeKey);
                                var mapping = findValueInMapping(jsHash, eventsMapping);
                                if (mapping && mapping.result && mapping.matches) {
                                    mapping.matches.forEach(function(mapping) {
                                        if (mapping.value) {
                                            if (s.events.indexOf(mapping.value) < 0) {
                                                s.events += ',' + mapping.value + '=' + expandedEvt.EventAttributes[eventAttributeKey];
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        var productAttributes = expandedEvt.EventAttributes;
                        productDetails.push(productAttributes.Category || '', productAttributes.Name, productAttributes.Id, productAttributes.Quantity || 1, productAttributes['Item Price'] || 0);
                        for (var productAttributeKey in expandedEvt.EventAttributes) {
                            if (expandedEvt.EventAttributes.hasOwnProperty(productAttributeKey)) {
                                productIncrementorMapping.forEach(function(productIncrementorMap) {
                                    if (productIncrementorMap.map === productAttributeKey) {
                                        incrementor.push(productIncrementorMap.value + '='+ productAttributes[productAttributeKey]);
                                        if (s.events.indexOf(productIncrementorMap.value) < 0) {
                                            s.events += ',' + productIncrementorMap.value;
                                        }
                                    }
                                });
                                productMerchandisingMapping.forEach(function(productMerchandisingMap) {
                                    if (productMerchandisingMap.map === productAttributeKey) {
                                        merchandising.push(productMerchandisingMap.value + '='+ productAttributes[productAttributeKey]);
                                    }
                                });
                            }
                        }
                        productBuilder.push(productDetails.join(';'), incrementor.join('|'), merchandising.join('|'));
                        product = productBuilder.join(';');
                        allProducts.push(product);
                    }
                });

                s.products = allProducts.join(',');
            } catch (e) {
                window.console.log(e);
            }

        }

        function logPageView(event) {
            try {
                s.pageName = event.EventName || undefined;
                s.t();
                s.clearVars();
                return true;
            }
            catch (e) {
                s.clearVars();
                return {error: 'logPageView not called, error ' + e};
            }
        }

        function logEvent(event, linkTrackVars, mappingMatches) {
            try {
                if (mappingMatches) {
                    mappingMatches.forEach(function(match) {
                        if (s.events.length === 0) {
                            s.events += match.value;
                        } else {
                            s.events += ',' + match.value;
                        }
                    });
                    s.linkTrackEvents = s.events;
                    s.pageName = event.EventName || window.document.title;
                    linkTrackVars.push('events', 'pageName');
                    s.linkTrackVars = linkTrackVars;
                    s.tl(true, 'o', event.EventName);
                    s.clearVars();
                    return true;
                } else {
                    s.clearVars();
                    window.console.log('event name not mapped, aborting event logging');
                }
            }
            catch (e) {
                s.clearVars();
                return {error: e};
            }
        }

        // .map is the attribute passed through, .value is the eVar value
        function setEvars(event, linkTrackVars) {
            var eventAttributes = event.EventAttributes;
            for (var eventAttributeKey in eventAttributes) {
                if (eventAttributes.hasOwnProperty(eventAttributeKey)) {
                    eVarsMapping.forEach(function(eVarMap) {
                        if (eVarMap.map === eventAttributeKey) {
                            s[eVarMap.value] = eventAttributes[eventAttributeKey];
                            if (linkTrackVars) {
                                linkTrackVars.push(eVarMap.value);
                            }
                        }
                        if (event.EventName === eVarMap.map) {
                            s[eVarMap.value] = event.EventName;
                        }
                    });
                }
            }
        }

        // .map is the attribute passed through, .value is the prop value
        function setProps(event, linkTrackVars) {
            var eventAttributes = event.EventAttributes;
            for (var eventAttributeKey in eventAttributes) {
                if (eventAttributes.hasOwnProperty(eventAttributeKey)) {
                    propsMapping.forEach(function(propMap) {
                        if (propMap.map === eventAttributeKey) {
                            s[propMap.value] = eventAttributes[eventAttributeKey];
                            if (linkTrackVars) {
                                linkTrackVars.push(propMap.value);
                            }
                        }
                    });
                }
            }
        }

        // .map is the attribute passed through, .value is the hier value
        function setHiers(event, linkTrackVars) {
            var eventAttributes = event.EventAttributes;
            for (var eventAttributeKey in eventAttributes) {
                if (eventAttributes.hasOwnProperty(eventAttributeKey)) {
                    var jsHash = calculateJSHash(event.EventDataType, event.EventCategory, eventAttributeKey);
                    var mapping = findValueInMapping(jsHash, hiersMapping);
                    if (mapping && mapping.result && mapping.matches) {
                        mapping.matches.forEach(function(mapping) {
                            if (mapping.value) {
                                s[mapping.value] = eventAttributes[eventAttributeKey];
                                if (linkTrackVars) {
                                    linkTrackVars.push(mapping.value);
                                }
                            }
                        });
                    }
                }
            }
        }

        // .map is the attribute passed through, .value is the contextData value
        function setContextData(event, linkTrackVars) {
            var eventAttributes = event.EventAttributes;
            for (var eventAttributeKey in eventAttributes) {
                if (eventAttributes.hasOwnProperty(eventAttributeKey)) {
                    contextVariableMapping.forEach(function(contextVariableMap) {
                        if (contextVariableMap.map === eventAttributeKey) {
                            s.contextData[contextVariableMap.value] = eventAttributes[eventAttributeKey];
                            if (linkTrackVars) {
                                linkTrackVars.push('contextData.' + contextVariableMap.value);
                            }
                        }
                    });
                }
            }
        }

        function onUserIdentified(mpUserObject) {
            if (isInitialized) {
                var userIdentities = mpUserObject.getUserIdentities().userIdentities;

                var identitiesToSet = {};
                if (Object.keys(userIdentities).length) {
                    for (var identity in userIdentities) {
                        identitiesToSet[identity] = {
                            id: userIdentities[identity]
                        };
                    }
                } else {
                    // no user identities means there was a logout, so set all current customer ids to null
                    var currentAdobeCustomerIds = s.visitor.getCustomerIDs();
                    for (var currentIdentityKey in currentAdobeCustomerIds) {
                        identitiesToSet[currentIdentityKey] = null;
                    }
                }

                try {
                    s.visitor.setCustomerIDs(identitiesToSet);
                } catch (e) {
                    return 'Error calling setCustomerIDs on adobe';
                }
            }
            else {
                return 'Can\'t call setUserIdentity on forwarder ' + name + ', not initialized';
            }
        }

        this.init = initForwarder;
        this.onUserIdentified = onUserIdentified;
        this.process = processEvent;
    };

    if (!window || !window.mParticle || !window.mParticle.addForwarder) {
        return;
    }

    window.mParticle.addForwarder({
        name: name,
        constructor: constructor
    });
})(window);