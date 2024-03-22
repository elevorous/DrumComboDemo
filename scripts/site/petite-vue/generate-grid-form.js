/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/generate-grid-form.js"></script>
*
* USAGE:
*   import { GenerateGridForm } from "generate-grid-form";
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
* @return {object} - a GenerateGridForm instance
*/
export function GenerateGridForm(props) {
    return {
        $template: '#generate-grid-form-template',

        /* ------------------ Fields ------------------ */
        nValue: 4,
        currentVal: null,
        cachedCombinations: [],     // TODO: don't cache the HTML perhaps, just the combination array

        /* ------------------ Getters ------------------ */
        get minNValue() { return 2; },
        get maxNValue() { return 9; },

        /* ------------------ Functions ------------------ */
        /**
        * @param {object} event - the onsubmit event
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
