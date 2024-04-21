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
* @Component
* A petite-vue Component representing
*
* @see /templates/site/petite-vue/consent-banner.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a ConsentBannerComponent instance
*/
export function ConsentBannerComponent(props) {
    let analyticsId = null;

    return {
        $template: '#consent-banner-component-template',

        /* ------------------ Fields ------------------ */
        // TODO: woulc be better to unmount / deactivate. Also pagemanager should dictate whether this component is
        // mounted in the first place if the consent level is already set.
        isHidden: true,

        /* ------------------ Getters ------------------ */

        /* ------------------ Functions ------------------ */
        submitConsent(consentLevel) {
            consentLevel = parseInt(consentLevel);

            if (consentLevel === SiteUtils.Consent.Level.FUNCTIONAL_AND_ANALYTICS) {
                SiteUtils.Analytics.setupAnalytics(analyticsId);
            }
            else {
                // remove any analytics cookies which might have been lingering
                SiteUtils.Analytics.deleteAnalyticsCookies();
            }

            SiteUtils.Consent.setSiteConsentLevel(consentLevel);
            this.isHidden = true;
        },
        /**
         * TODO: Not sure that this is the best place for passing in the analyticsId, as a Component can be re-mounted,
         * but it will do for now.
         */
        mounted(_analyticsId) {
            if (!analyticsId) {
                analyticsId = _analyticsId;
            }

            let consentLevel = SiteUtils.Consent.getSiteConsentLevel() || (this.isHidden = false);

            // this will be NaN if we didn't have a consent level from the cookies
            consentLevel = parseInt(consentLevel);

            if (consentLevel === SiteUtils.Consent.Level.FUNCTIONAL_AND_ANALYTICS) {
                SiteUtils.Analytics.setupAnalytics(analyticsId);
            }
            else {
                // remove any analytics cookies which might have been lingering
                SiteUtils.Analytics.deleteAnalyticsCookies();
            }
        }
    }
}
