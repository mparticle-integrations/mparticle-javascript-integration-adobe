// START OF ADOBEKIT SERVERSIDE MPARTICLE JS INTEGRATION

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

import isobject from 'isobject';

    var name = 'Adobe',
        MARKETINGCLOUDIDKEY = 'mid',
        ADOBEMODULENUMBER = 124;

    var constructor = function () {
        var self = this;
        self.name = name;

        function initForwarder(forwarderSettings) {
            mParticle._setIntegrationDelay(ADOBEMODULENUMBER, true);
            try {
                // On first load, adobe will call the callback correctly if no MCID exists
                // On subsequent loads, it does not, so we need to manually call setMCIDOnIntegrationAttributes
                var mcID = Visitor.getInstance(forwarderSettings.organizationID).getMarketingCloudVisitorID(setMarketingCloudId);
                if (mcID && mcID.length > 0) {
                    setMCIDOnIntegrationAttributes(mcID);
                }
                return 'Adobe Server Side Integration Ready';
            } catch (e) {
                return 'Failed to initialize: ' + e;
            }
        }
        function setMarketingCloudId(mcid) {
            setMCIDOnIntegrationAttributes(mcid);
        }

        this.init = initForwarder;
    };

    function setMCIDOnIntegrationAttributes(mcid) {
        var adobeIntegrationAttributes = {};
        adobeIntegrationAttributes[MARKETINGCLOUDIDKEY] = mcid;
        mParticle.setIntegrationAttribute(ADOBEMODULENUMBER, adobeIntegrationAttributes);
        mParticle._setIntegrationDelay(ADOBEMODULENUMBER, false);
    }

    function getId() {
        return moduleId;
    }

    if (window && window.mParticle && window.mParticle.addForwarder) {
        window.mParticle.addForwarder({
            name: name,
            constructor: constructor,
            getId: getId
        });
    }

    function register(config) {
        if (!config) {
            window.console.log('You must pass a config object to register the kit ' + name);
            return;
        }
        // server
        if (!isobject(config)) {
            window.console.log('\'config\' must be an object. You passed in a ' + typeof config);
            return;
        }

        if (isobject(config.kits)) {
            config.kits[name] = {
                constructor: constructor
            };
        } else {
            config.kits = {};
            config.kits[name] = {
                constructor: constructor
            };
        }
        window.console.log('Successfully registered ' + name + ' to your mParticle configuration');
    }

    export default {
        register: register
    };