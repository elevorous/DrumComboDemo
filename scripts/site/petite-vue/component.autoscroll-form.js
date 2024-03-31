/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.autoscroll-form.js"></script>
*
* USAGE:
*   import { AutoscrollFormComponent } from "component.autoscroll-form";
*
* @author elevorous
*/

'use strict';

/**
* @Component
* A petite-vue Component representing a form containing controls for generating a combination grid.
*
* @see /templates/site/petite-vue/autoscroll-form.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a AutoscrollFormComponent instance
*/
export function AutoscrollFormComponent(props) {
    return {
        $template: '#autoscroll-form-component-template',

        /* ------------------ Static ------------------ */
        // TODO: static-ize
        get MIN_REPETITIONS() { return 1; },
        get MAX_REPETITIONS() { return 20; },
        get MIN_PREAMBLE_BEATS() { return 0; },
        get MAX_PREAMBLE_BEATS() { return 16; },

        /* ------------------ Fields ------------------ */
        // TODO: may be a better idea to move preamble and repetitions to the MetronomeFormComponent?
        enableAutoScroll: false,
        repetitions: 1,
        enablePreamble: false,
        preambleBeats: 4,

        /* ------------------ Getters ------------------ */

        /* ------------------ Setters ------------------ */
        set enableAutoScroll(value) {
            this.enableAutoScroll = value;
            this.setAutoScrollEnabledAttr(this.enableAutoScroll);
        },

        set repetitions(value) {
            if (value < this.MIN_REPETITIONS) {
                value = this.MIN_REPETITIONS;
            }
            else if (value > this.MAX_REPETITIONS) {
                value = this.MAX_REPETITIONS;
            }

            this.repetitions = value;
        },

        set preambleBeats(value) {
            if (value < this.MIN_PREAMBLE_BEATS) {
                value = this.MIN_PREAMBLE_BEATS;
            }
            else if (value > this.MAX_PREAMBLE_BEATS) {
                value = this.MAX_PREAMBLE_BEATS;
            }

            // TODO: this actually needs to be set on the metronome.
            this.preambleBeats = value;
        },

        /* ------------------ Functions ------------------ */

        setAutoScrollEnabledAttr(value) {
            document.getElementsByTagName('body')[0].setAttribute("data-auto-scroll-enabled", value);
        },

        /**
        * TODO: hmm.. maybe these are better suited to the renderarea component?
        * @return {undefined}
        */
        startAutoScroll() {
            // currentVisibleRows = getCurrentVisibleRows();
            // currentActiveVisibleRowIndex = 0;
            // this.setActiveVisibleRow(currentActiveVisibleRowIndex);
        },

        /**
        * @return {undefined}
        */
        stopAutoScroll() {
            //document.querySelectorAll(".combination-wrapper[data-active]").forEach((e) => e.removeAttribute("data-active"));
            //ROOT.style.setProperty("--current-visible-row-index", 0);
            //currentVisibleRows = null;
            //currentActiveVisibleRowIndex = 0;
        },

        /**
        * @param {int} index
        * @return {undefined}
        */
        setActiveVisibleRow(index) {
            // TODO: sanity checks etc.
            return;
            if (index - 1 >= 0) {
                currentVisibleRows?.item(index - 1).removeAttribute("data-active");
            }
            currentVisibleRows?.item(index)?.setAttribute("data-active", "");
            ROOT.style.setProperty("--current-visible-row-index", index);
        },

        /**
         *
         * @param {object} tickData
         */
        doOnTick(event) {
            return;

            const tickData = event.detail;
            //console.log(tickData);

            // TODO: this shouldn't take into account preamble beats.
            if (tickData.contextData.metronome.barsSinceStarted && tickData.contextData.metronome.newBarStarted &&
                tickData.contextData.metronome.barsSinceStarted % barRepetitions == 0
            ) {
                ++currentActiveVisibleRowIndex;
                // TODO: this is the wrong place for this, as it still lets the very first beat of the "next" bar to play.
                if (currentActiveVisibleRowIndex >= currentVisibleRows.length) {
                    stopMetronome();
                }
                else {
                    setActiveVisibleRow(currentActiveVisibleRowIndex);
                }
            }
        },

        /**
        *
        */
        getCurrentVisibleRows() {
            return document.querySelectorAll(".combination-wrapper:not([hidden])");
        }
    }
}
