/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.render-area.js"></script>
*
* USAGE:
*   import { RenderAreaComponent } from "component.render-area";
*
* @author elevorous
*/

'use strict';

import { mixin__PageManagerAware } from "page-manager";


/**
* @Component
* A petite-vue Component representing
*
* @see /templates/site/petite-vue/render-area.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a RenderAreaComponent instance
*/
export function RenderAreaComponent(props) {
    let component = {
        $template: '#render-area-component-template',

        /* ------------------ Getters ------------------ */
        get currentCombinations() {
            return this._manager?.currentCombinations || [];
        },
        get hideEmptyRow() {
            return this._manager?.hideEmptyRow;
        }
    };

    return mixin__PageManagerAware(component);
}
