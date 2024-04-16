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

const ANALYTICS_ID_REGEX = /^G-[A-Z0-9]{10}$/g;

/**
* purposefully not made accessible on the component
*   TODO: maybe move to a SiteUtil
*
* @param {string} analyticsId
* @return {undefined}
*/
function setupAnalytics(analyticsId) {
    if (!ANALYTICS_ID_REGEX.test(analyticsId)) {
        console.error("That was a bad analytics ID!");
        return;
    }

    let script = document.createElement('script');
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + analyticsId;
    script.async = true;

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', analyticsId);

    document.body.append(script);
}

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
    let analyticsId = null;

    return {
        $template: '#consent-banner-component-template',

        /* ------------------ Fields ------------------ */
        // TODO: woulc be better to unmount / deactivate. Also pagemanager should dictate whether this component is
        // mounted in the first place if the consent level is already set.
        isHidden: false,

        /* ------------------ Getters ------------------ */

        /* ------------------ Functions ------------------ */
        submitConsent(consentLevel) {
            console.log(this);
            consentLevel = parseInt(consentLevel);

            if (consentLevel === SiteUtils.Consent.Level.FUNCTIONAL_AND_ANALYTICS) {
                setupAnalytics(analyticsId);
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
        }
    }
}
