/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.side-menu.js"></script>
*
* USAGE:
*   import { SideMenuComponent } from "component.side-menu";
*
* @author elevorous
*/

'use strict';

/**
* @Component
* A petite-vue Component representing
*
* @see /templates/site/petite-vue/side-menu.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a SideMenuComponent instance
*/
export function SideMenuComponent(props) {
    return {
        $template: '#side-menu-component-template',

        /* ------------------ Fields ------------------ */
        menuItems: props.menuItems || [],
        isOpen: false,

        /* ------------------ Getters ------------------ */

        /* ------------------ Functions ------------------ */
        toggleMenu() {
            this.isOpen = !this.isOpen;
        }
    }
}
