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
            isInitialized = false,
            reportingService,
            eventQueue = [],
            contextVariableMapping = {},
            productIncrementorMapping = {},
            productMerchandisingMapping = {},
            eventsMapping = {},
            propsMapping = {},
            eVarsMapping = {},
            hiersMapping = {},
            trackStateMapping = {};

        self.name = name;

        function initForwarder(forwarderSettings, service, testMode) {
            settings = forwarderSettings;
            reportingService = service;

            try {
                loadMappings();
                if (!testMode) {
                    loadVisitorAndAppMeasurementScripts();
                } else {
                    isInitialized = true;
                }

                return 'ClientSDK successfully loaded';
            } catch (e) {
                //TODO remove console.log
                window.console.log(e);
                return 'Failed to initialize: ' + e;
            }
        }


        //TODO: mappings will change, tests will need to be updated
        function loadMappings() {
            var parsedEvars = JSON.parse(settings.evars.replace(/&quot;/g, '\"'));
            var parsedProps = JSON.parse(settings.props.replace(/&quot;/g, '\"'));
            var parsedProductIncrementor = JSON.parse(settings.productIncrementor.replace(/&quot;/g, '\"'));
            var parsedProductMerchandising = JSON.parse(settings.productMerchandising.replace(/&quot;/g, '\"'));
            var parsedCommerceEventsAsTrackState = JSON.parse(settings.commerceEventsAsTrackState.replace(/&quot;/g, '\"'));
            var parsedHvars = JSON.parse(settings.hvars.replace(/&quot;/g, '\"'));
            var parsedEvents = JSON.parse(settings.events.replace(/&quot;/g, '\"'));
            var parsedContextVariables = JSON.parse(settings.contextVariables.replace(/&quot;/g, '\"'));

            parsedEvars.forEach(function(evarPair) {
                eVarsMapping[evarPair.map] = evarPair.value;
            });
            parsedProps.forEach(function(evarPair) {
                propsMapping[evarPair.map] = evarPair.value;
            });

            parsedProductIncrementor.forEach(function(evarPair) {
                productIncrementorMapping[evarPair.map] = evarPair.value;
            });
            parsedProductMerchandising.forEach(function(evarPair) {
                productMerchandisingMapping[evarPair.map] = evarPair.value;
            });
            parsedCommerceEventsAsTrackState.forEach(function(evarPair) {
                trackStateMapping[evarPair.map] = evarPair.value;
            });
            parsedHvars.forEach(function(evarPair) {
                hiersMapping[evarPair.map] = evarPair.value;
            });
            parsedEvents.forEach(function(evarPair) {
                eventsMapping[evarPair.map] = evarPair.value;
            });
            parsedContextVariables.forEach(function(evarPair) {
                contextVariableMapping[evarPair.map] = evarPair.value;
            });
        }

        function loadVisitorAndAppMeasurementScripts() {
            var visitorScript = document.createElement('script');
            visitorScript.type = 'text/javascript';
            visitorScript.async = false;
            visitorScript.className += 'visitorAPI';
            visitorScript.src = ('./Integrations/mparticle-javascript-integration-adobe/src/VisitorAPI.js');

            var firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(visitorScript, firstScript);

            visitorScript.onload = (function() {
                var appMeasurementScript = document.createElement('script');
                appMeasurementScript.type = 'text/javascript';
                appMeasurementScript.async = false;
                appMeasurementScript.className += 'visitorAPI';
                appMeasurementScript.src = ('./Integrations/mparticle-javascript-integration-adobe/src/AppMeasurement.js');

                var visitorAPI = document.getElementsByClassName('visitorAPI')[0];

                visitorAPI.parentNode.insertBefore(appMeasurementScript, visitorAPI.nextSibling);

                try {
                    appMeasurementScript.onload = function() {
                        s=s_gi(settings.reportSuiteIDs);
                        s.visitor = Visitor.getInstance(settings.organizationID);
                        s.trackingServer=settings.trackingServerURL;
                        s.trackingServerSecure=settings.trackingServerURLSecure;
                        s.trackDownloadLinks=true;
                        s.trackExternalLinks=true;
                        s.trackInlineStats=true;
                        s.linkDownloadFileTypes='exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx';
                        s.linkInternalFilters='javascript:'; //optional: add your internal domain here
                        s.linkLeaveQueryString=false;
                        s.linkTrackVars='None';
                        s.linkTrackEvents='None';
                        s.visitorNamespace = 'bigbadwolf';
                        s.prop1 = (typeof(Visitor) != 'undefined' ? 'VisitorAPI Present' : 'VisitorAPI Missing');
                        window.s = s;
                        isInitialized = true;
                        window.console.log('isiniitalized' + true);
                    };
                } catch (e) {
                    window.console.log(e);
                }
            });
        }

        function processEvent(event) {
            var reportEvent = false;
            var linkTrackVars = [];
            //review if we should put these first
            // setEvars(event.EventAttributes);
            // setContextData(event.EventAttributes);
            // setHiers(event.EventAttributes);
            // setProps(event.EventAttributes);
            // productimpression(event.EventAttributes);
            if (isInitialized) {
                try {
                    if (event.EventDataType === MessageType.PageView) {
                        reportEvent = logPageView(event);
                    }
                    else if (event.EventDataType === MessageType.Commerce) {
                        processCommerceTransaction(event);
                        reportEvent = true;

                    }
                    else if (event.EventDataType === MessageType.PageEvent) {
                        reportEvent = logEvent(event, linkTrackVars);
                    }

                    // s.clearVars();
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
            else {
                eventQueue.push(event);
            }

            return 'Can\'t send to forwarder ' + name + ', not initialized. Event added to queue.';
        }

        function processCommerceTransaction(event) {
            //implement processCommerceTransaction
            window.console.log('implement processCommerceTransaction,' + event);
        }

        function logEvent(event) {
            try {
                if (eventsMapping[event.EventName]) {
                    s.events = eventsMapping[event.EventName];
                    // linkTrackVars.push('events');
                    // s.linkTrackEvents = eventsMapping[event.EventName];
                    setEvars(event);
                    setProps(event);
                    setHiers(event);
                    setContextData(event);
                    s.pageName = window.document.title;
                    s.t();
                    s.clearVars();
                    // s.tl(true, 'o', event.EventName);
                } else {
                    window.console.log('event name not mapped, aborting event logging');
                }
            }
            catch (e) {
                s.clearVars();
                return {error: e};
            }
        }

        function logPageView(event) {
            try {
                // TODO: Uncertain if `s.events` should be = `s.pageName`
                s.events = event.EventName;
                s.pageName = event.EventName;
                setEvars(event);
                setProps(event);
                setHiers(event);
                setContextData(event);
                s.clearVars();
            }
            catch (e) {
                s.clearVars();
                return {error: e};
            }
        }

        function setEvars(event) {
            var eventAttributes = event.EventAttributes;
            for (var eventAttributeKey in eventAttributes) {
                if (eventAttributes.hasOwnProperty(eventAttributeKey)) {
                    for (var eVarsMappingKey in eVarsMapping) {
                        if (eVarsMapping.hasOwnProperty(eVarsMappingKey)) {
                            if (eventAttributeKey === eVarsMappingKey) {
                                s[eVarsMapping[eVarsMappingKey]] = eventAttributes[eventAttributeKey];
                            }
                        }
                    }
                }
            }

            if (eVarsMapping[event.EventName]) {
                s[eVarsMapping[event.EventName]] = event.EventName;
            }
        }

        function setProps(event) {
            var eventAttributes = event.EventAttributes;
            for (var eventAttributeKey in eventAttributes) {
                if (eventAttributes.hasOwnProperty(eventAttributeKey)) {
                    for (var propsMappingKey in propsMapping) {
                        if (propsMapping.hasOwnProperty(propsMappingKey)) {
                            if (eventAttributeKey === propsMappingKey) {
                                s[propsMapping[propsMappingKey]] = eventAttributes[eventAttributeKey];
                            }
                        }
                    }
                }
            }
        }

        function setHiers(event) {
            var eventAttributes = event.EventAttributes;
            for (var eventAttributeKey in eventAttributes) {
                if (eventAttributes.hasOwnProperty(eventAttributeKey)) {
                    for (var hiersMappingKey in hiersMapping) {
                        if (hiersMapping.hasOwnProperty(hiersMappingKey)) {
                            if (eventAttributeKey === hiersMappingKey) {
                                s[hiersMapping[hiersMappingKey]] = eventAttributes[eventAttributeKey];
                            }
                        }
                    }
                }
            }
        }

        function setContextData(event) {
            var eventAttributes = event.EventAttributes;
            for (var eventAttributeKey in eventAttributes) {
                if (eventAttributes.hasOwnProperty(eventAttributeKey)) {
                    for (var contextValueKey in contextVariableMapping) {
                        if (contextVariableMapping.hasOwnProperty(contextValueKey)) {
                            if (eventAttributeKey === contextValueKey) {
                                s.contextData[contextVariableMapping[contextValueKey]] = eventAttributes[contextValueKey];
                            }
                        }
                    }
                }
            }
        }

        function setUserIdentity(id, type, testSVariable) {
            s = s || testSVariable;
            if (isInitialized) {
                if (type == window.mParticle.IdentityType.CustomerId) {
                    s.visitor.setCustomerIDs({
                        userId: {
                            id: id,
                            authState: Visitor.AuthState.UNKNOWN
                        }
                    });
                } else {
                    return 'Can\'t call setUserIdentity on forwarder ' + name + ', identity type not supported';
                }
            }
            else {
                return 'Can\'t call setUserIdentity on forwarder ' + name + ', not initialized';
            }
        }

        function isObject(value) {
            var objType = Object.prototype.toString.call(value);

            return objType === '[object Object]'
                || objType === '[object Error]';
        }

        this.init = initForwarder;
        this.setUserIdentity = setUserIdentity;
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
