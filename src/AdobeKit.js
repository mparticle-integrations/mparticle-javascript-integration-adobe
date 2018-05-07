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
            eventQueue = [];

        self.name = name;

        function initForwarder(forwarderSettings, service, testMode) {
            settings = forwarderSettings;
            reportingService = service;

            try {
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

        this.init = initForwarder;
    };

    if (!window || !window.mParticle || !window.mParticle.addForwarder) {
        return;
    }

    window.mParticle.addForwarder({
        name: name,
        constructor: constructor
    });

})(window);
