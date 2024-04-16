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

        /* ------------------ Getters ------------------ */

        /* ------------------ Functions ------------------ */
        submitConsent(event) {
            console.log(event);
            console.log(this);
        }
    }
}
