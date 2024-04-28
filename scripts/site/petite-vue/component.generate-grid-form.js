/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.generate-grid-form.js"></script>
*
* USAGE:
*   import { GenerateGridFormComponent } from "component.generate-grid-form";
*
* @author elevorous
*/

'use strict';

import { CombinationGeneratorService } from "combination-generator";
import { mixin__PageManagerAware } from "page-manager";


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
    let component = {
        $template: '#generate-grid-form-component-template',

        /* ------------------ Fields ------------------ */
        nValue: 4,
        currentVal: null,
        cachedCombinations: [],     // TODO: don't cache the HTML perhaps, just the combination array
                                    //      Worth storing in some other type of component to make it accessible
                                    //          globally? Maybe a SiteUtils class?

        /* ------------------ Getters ------------------ */
        get minNValue() { return 2; },
        get maxNValue() { return 9; },

        /* ------------------ Functions ------------------ */
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

            this.currentVal = this.nValue;
            this.updateManager({'currentCombinations' : combinations});
        }
    };

    return mixin__PageManagerAware(component);
}
