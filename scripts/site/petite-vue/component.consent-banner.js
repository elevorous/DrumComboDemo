/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.consent-banner.js"></script>
*
* USAGE:
*   import { ConsentBannerComponent } from "component.consent-banner";
*
* @author elevorous
*/

'use strict';

import { SiteUtils } from "site-utils";

/**
* TODO: implement!
*
* @Component
* A petite-vue Component representing
*
* @see /templates/site/petite-vue/consent-banner.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a ConsentBannerComponent instance
*/
export function ConsentBannerComponent(props) {
    return {
        $template: '#consent-banner-component-template',

        /* ------------------ Fields ------------------ */
        // TODO: woulc be better to unmount / deactivate. Also pagemanager should dictate whether this component is
        // mounted in the first place if the consent level is already set.
        isHidden: false,

        /* ------------------ Getters ------------------ */

        /* ------------------ Functions ------------------ */
        submitConsent(consentLevel) {
            consentLevel = parseInt(consentLevel);

            if (consentLevel === SiteUtils.Consent.Level.FUNCTIONAL_AND_ANALYTICS) {
                // TODO: allow google analytics.
                console.log('allow ga');
            }

            SiteUtils.Consent.setSiteConsentLevel(consentLevel);
            this.isHidden = true;
        }
    }
}
