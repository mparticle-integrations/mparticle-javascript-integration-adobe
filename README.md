# integration-adobe

Adobe Javascript integration for mParticle

#License

Copyright 2018 mParticle, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


Note that there are 2 ways to send data to Adobe, via the web (client side), or via mParticle's servers (server side). When mParticle is implemented via a script tag, either of these is a possibility. When self-hosting mParticle, however, only server side is available.

Notes for future developers:
* Update only code in src/
* src/Adobe-SDKs includes AppMeasurement.js and VisitorAPI.js - update these if new versions are released
* running npm:build will create the following:
    * `AdobeKit.js` - Client side integration
        * `src/Adobe-SDKs/AppMeasurement.js` & `src/Adobe-SDKs/VisitorApi.js` are concatenated with `src/AdobeKit-dev.js`, to create `AdobeKit.js` in the root directory
    * `AdobeServerSideKit.js` - Server side integration
        * `src/AdobeServerSiteKit-dev.js` is an ES6 module. We use rollup to turn it into an IIFE, which gets prepended with `src/Adobe-SDKs/VisitorAPI.js` to create `AdobeServerSideKit.js`
    * `dist/