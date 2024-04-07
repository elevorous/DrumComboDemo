/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.view-options-form.js"></script>
*
* USAGE:
*   import { ViewOptionsFormComponent } from "component.view-options-form";
*
* @author elevorous
*/

'use strict';

import { SiteUtils } from "site-utils";

/**
* @Component
* A petite-vue Component representing
*
* @see /templates/site/petite-vue/view-options-form.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a ViewOptionsFormComponent instance
*/
export function ViewOptionsFormComponent(props) {
    const ROOT = document.documentElement;

    return {
        $template: '#view-options-form-component-template',

        /* ------------------ Static ------------------ */
        get MIN_CELL_HEIGHT() { return 2; },
        get MAX_CELL_HEIGHT() { return 6; },
        get MIN_ROW_GAP() { return 0; },
        get MAX_ROW_GAP() { return 3; },

        /* ------------------ Fields ------------------ */
        manager: null,
        hideEmptyRow: true,
        rowGap: 0,
        cellHeight: 3,

        /* ------------------ Getters ------------------ */


        /* ------------------ Setters ------------------ */
        registerManager(manager) {
            this.manager = manager;
            // TODO syncWithManager()
            return this;
        },
        updateManager(updateMap) {
            if (this.manager && updateMap) {
                for (const key in updateMap) {
                    this.manager[key] = updateMap[key];
                }
                console.log(this.manager);
            }
            return this;
        },
        set hideEmptyRow(value) {
            // TODO: needs testing!
            this.hideEmptyRow = value;
            updateManager({'hideEmptyRow': this.hideEmptyRow});
        },

        set rowGap(value) {
            this.rowGap = SiteUtils.Math.clamp(value, this.MIN_ROW_GAP, this.MAX_ROW_GAP);
            // ROOT.style.setProperty("--row-gap", val + "em");
        },

        set cellHeight(value) {
            this.cellHeight = SiteUtils.Math.clamp(value, this.MIN_CELL_HEIGHT, this.MAX_CELL_HEIGHT);
            // ROOT.style.setProperty("--cell-height", val + "em");
        },

        /* ------------------ Functions ------------------ */
    }
}
