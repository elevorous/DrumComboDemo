/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.generate-grid-form.js"></script>
*
* USAGE:
*   import { GenerateGridFormComponent } from "component.generate-grid-form";
*
* @author elevorous
*/

import { CombinationGeneratorService } from "combination-generator";

'use strict';

/**
* @Component
* A petite-vue Component representing a form containing controls for generating a combination grid.
*
* @see /templates/site/petite-vue/generate-grid-form.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a GenerateGridFormComponent instance
*/
export function GenerateGridFormComponent(props) {
    return {
        $template: '#generate-grid-form-component-template',

        /* ------------------ Fields ------------------ */
        manager: null,
        nValue: 4,
        currentVal: null,
        cachedCombinations: [],     // TODO: don't cache the HTML perhaps, just the combination array
                                    //      Worth storing in some other type of component to make it accessible
                                    //          globally? Maybe a SiteUtils class?

        /* ------------------ Getters ------------------ */
        get minNValue() { return 2; },
        get maxNValue() { return 9; },

        /* ------------------ Functions ------------------ */
        // TODO: would be good for this to be a proper class so that all components can use the same register function
        registerManager(manager) {
            this.manager = manager;
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
        /**
        * Triggered on submit of the form element
        *
        * @return {undefined}
        */
        generateGrid() {
            // do nothing, we're already showing the correct grid
            if (this.currentVal === this.nValue) return;

            let combinations = null;

            // if we don't have this generated HTML in the cache, create it
            if (!this.cachedCombinations[this.nValue]) {
                combinations = CombinationGeneratorService.generateCombinations(this.nValue);
                combinations = CombinationGeneratorService.sortCombinations(combinations);
                // this.cachedCombinations[this.nValue] = combinations.map((combo, i) => this.createCombinationHTML(combo, i)).join('');
            }

            // TODO: really want a master Component for the renderArea
            //document.getElementById("renderArea").innerHTML = this.cachedCombinations[this.nValue];
            this.currentVal = this.nValue;

            this.updateManager({'currentCombinations' : combinations});

            // TODO: this is a global function and needs to be accessible to this Component
            // toggleFirstRowVisibility();
        }
    }
}
