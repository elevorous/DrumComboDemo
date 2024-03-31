/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.control-panel.js"></script>
*
* USAGE:
*   import { ControlPanelComponent } from "component.control-panel";
*
* @author elevorous
*/

'use strict';

/**
* @Component
* A petite-vue Component representing
*
* @see /templates/site/petite-vue/control-panel.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a ControlPanelComponent instance
*/
export function ControlPanelComponent(props) {
    return {
        $template: '#control-panel-component-template',
        controlPanelComponents: props.controlPanelComponents
    }
}
