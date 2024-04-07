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
    return {
        $template: '#render-area-component-template',
        manager: null,
        registerManager(manager) {
            this.manager = manager;
            return this;
        },

        get currentCombinations() {
            return this.manager?.currentCombinations || [];
        },
        get hideEmptyRow() {
            return this.manager?.hideEmptyRow;
        }
    }
}
