/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.metronome-form.js"></script>
*
* USAGE:
*   import { MetronomeFormComponent } from "component.metronome-form";
*
* @author elevorous
*/

'use strict';

import { CallbackMetronome } from "callback-metronome";

/**
* @Component
* A petite-vue Component representing a form containing controls for generating a combination grid.
*
* @see /templates/site/petite-vue/metronome-form.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a MetronomeFormComponent instance
*/
export function MetronomeFormComponent(props) {
    return {
        $template: '#metronome-form-component-template',

        /* ------------------ Static ------------------ */
        // TODO: these should be truly static. To do that, you need to make this a proper class, rather than a plain
        //  function
        get DEFAULT_BPM() { return 60; },
        get MIN_BPM() { return 20; },
        get MAX_BPM() { return 280; },
        get MIN_BEATS_PER_BAR() { return 1; },
        get MAX_BEATS_PER_BAR() { return 16; },

        /* ------------------ Fields ------------------ */
        // TODO: the metronome has to be a global singleton!
        metronome: new CallbackMetronome(60),

        /* ------------------ Getters ------------------ */
        get bpm() {
            return this.metronome.tempo;
        },

        get beatsPerBar() {
            return this.metronome.beatsPerBar
        },

        /* ------------------ Setters ------------------ */
        set bpm(value) {
            if (value < this.MIN_BPM) {
                value = this.MIN_BPM;
            }
            else if (value > this.MAX_BPM) {
                value = this.MAX_BPM;
            }

            this.metronome.tempo = value;
        },

        set beatsPerBar(value) {
            if (value < this.MIN_BEATS_PER_BAR) {
                value = this.MIN_BEATS_PER_BAR;
            }
            else if (value > this.MAX_BEATS_PER_BAR) {
                value = this.MAX_BEATS_PER_BAR;
            }

            this.metronome.beatsPerBar = value;
        },

        /* ------------------ Functions ------------------ */

        /**
        * Start/stop the metronome
        * @return {undefined}
        */
        toggleMetronome() {
            if (this.metronome.isRunning) {
                this.stopMetronome();
            }
            else {
                this.startMetronome();
            }
        },

        /**
        *
        * @return {undefined}
        */
        startMetronome() {
            this.setMetronomeRunningAttr(true);
            if (false && autoScrollEnabled) {
                this.metronome.clickCallbackFn = doOnTick;
                //startAutoScroll();
            }

            this.metronome.start();
        },

        /**
        *
        * @return {undefined}
        */
        stopMetronome() {
            this.metronome.stop();

            if (false && autoScrollEnabled) {
                this.metronome.clickCallbackFn = null;
                //stopAutoScroll();
            }

            this.setMetronomeRunningAttr(false);
        },

        /**
        *
        * @return {undefined}
        */
        setMetronomeRunningAttr(value) {
            document.getElementsByTagName('body')[0].setAttribute("data-metronome-running", value);
        }
    }
}
