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
        nValue: 4,
        currentVal: null,
        cachedCombinations: [],     // TODO: don't cache the HTML perhaps, just the combination array
                                    //      Worth storing in some other type of component to make it accessible
                                    //          globally?

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

            // if we don't have this generated HTML in the cache, create it
            if (!this.cachedCombinations[this.nValue]) {
                let combinations = CombinationGeneratorService.generateCombinations(this.nValue);
                combinations = CombinationGeneratorService.sortCombinations(combinations);
                this.cachedCombinations[this.nValue] = combinations.map((combo, i) => this.createCombinationHTML(combo, i)).join('');
            }

            // TODO: really want a master Component for the renderArea
            document.getElementById("renderArea").innerHTML = this.cachedCombinations[this.nValue];
            this.currentVal = this.nValue;

            // TODO: this is a global function and needs to be accessible to this Component
            // toggleFirstRowVisibility();
        },

        /**
        * TODO: probably move to the renderarea component.
        *
        * @param {string} combination - a string value of a binary representation of a number
        * @param {int} index - the numeric index to mark this combination as
        * @return {string} - the string output for a HTML structure representing the given combination
        */
        createCombinationHTML(combination, index) {
            const n = combination.length;
            return  `<div class="combination-wrapper">
                        <div>${index}</div>
                        <div class="combination" data-value="${combination}">
                            ${[...combination].map(i => `<div data-bit="${i}"></div>`).join('')}
                        </div>
                    </div>`;
        }
    }
}
