/**
* INCLUDE:
*   <script type="module" src="scripts/site/module/site-utils.js"></script>
*
* USAGE:
*   import { SiteUtils } from "site-utils";
*
* @author elevorous
*/

'use strict';

const MathUtils = {
    clamp: function(value, min, max) {
        return Math.min(Math.max(min, value), max);
    }
};

class SiteUtils {
    static get Math() {
        return MathUtils;
    }
}

export { SiteUtils };
