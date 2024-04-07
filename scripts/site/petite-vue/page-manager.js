/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/page-manager.js"></script>
*
* USAGE:
*   import { PageManager } from "page-manager";
*
* @author elevorous
*/

'use strict';

import { reactive } from "petite-vue-pro";

/**
* A petite-vue
*
* @return {object} - a new reactive Vue object which will serve as a global manager for the application
*/
export function PageManager() {
    return reactive({
        currentCombinations: null,
        hideEmptyRow: true,
    });
}
