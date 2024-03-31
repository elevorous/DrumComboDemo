//import { CallbackMetronome } from "callback-metronome";
import { createApp } from "petite-vue-pro";
import { GenerateGridFormComponent } from "component.generate-grid-form";
import { ControlPanelComponent } from "component.control-panel";
import { MetronomeFormComponent } from "component.metronome-form";

/**
*
* @author elevorous
*/
(function() {
    'use strict';

    // const N_VALUE_INPUT = document.getElementById("nValue");
    const ROW_GAP_INPUT = document.getElementById("rowGap");
    const CELL_HEIGHT_INPUT = document.getElementById("cellHeight");
    // const RENDER_AREA_DIV = document.getElementById("renderArea");
    const EXCLUDE_FIRST_ROW_CHECKBOX = document.getElementById("excludeFirstRow");
    const BPM_INPUT = document.getElementById("bpm");
    const METRONOME_TOGGLE_BUTTON = document.getElementById("metronomeToggleButton");
    const BODY = document.getElementsByTagName("body")[0];
    const AUTO_SCROLL_CHECKBOX = document.getElementById("enableAutoScroll");
    const REPETITIONS_INPUT = document.getElementById("repetitions");
    const BEATS_PER_BAR_INPUT = document.getElementById("beatsPerBar");
    const PREAMBLE_BEATS_INPUT = document.getElementById("preambleBeats");
    const PREAMBLE_CHECKBOX = document.getElementById("enablePreamble");

    const ROOT = document.documentElement;

    // TODO: source consts from the element attributes
    const DEFAULT_BPM = 60;
    const MIN_BPM = 20;
    const MAX_BPM = 280;

    const HTML_CACHE = {};

    // let currentVal = null;
    let autoScrollEnabled = false;
    //let metronome = new CallbackMetronome(DEFAULT_BPM);
    let currentVisibleRows = null;
    let barRepetitions = 1;
    let currentActiveVisibleRowIndex = 0;

    function setAutoScrollEnabledAttr(value) {
        BODY.setAttribute("data-auto-scroll-enabled", value);
    }

    /**
    * @return {undefined}
    */
    function startAutoScroll() {
        currentVisibleRows = getCurrentVisibleRows();
        currentActiveVisibleRowIndex = 0;
        setActiveVisibleRow(currentActiveVisibleRowIndex);
    }

    /**
    * @return {undefined}
    */
    function stopAutoScroll() {
        document.querySelectorAll(".combination-wrapper[data-active]").forEach((e) => e.removeAttribute("data-active"));
        ROOT.style.setProperty("--current-visible-row-index", 0);
        currentVisibleRows = null;
        currentActiveVisibleRowIndex = 0;
    }

    /**
    * @param {int} index
    * @return {undefined}
    */
    function setActiveVisibleRow(index) {
        // TODO: sanity checks etc.
        if (index - 1 >= 0) {
            currentVisibleRows?.item(index - 1).removeAttribute("data-active");
        }
        currentVisibleRows?.item(index)?.setAttribute("data-active", "");
        ROOT.style.setProperty("--current-visible-row-index", index);
    }

    /**
     *
     * @param {object} tickData
     */
    function doOnTick(event) {
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
    }

    /**
    * @return {undefined}
    */
    function toggleFirstRowVisibility() {
        let firstRow = document.querySelector(".combination-wrapper:first-child");
        EXCLUDE_FIRST_ROW_CHECKBOX.checked ? firstRow.setAttribute("hidden", "") : firstRow.removeAttribute("hidden");
    }

    /**
    *
    */
    function getCurrentVisibleRows() {
        return document.querySelectorAll(".combination-wrapper:not([hidden])");
    }

    /**
     * @return {undefined}
     */
    function initialize() {
        ROW_GAP_INPUT.addEventListener("change", (event) => {
            let val = ROW_GAP_INPUT.value;
            ROOT.style.setProperty("--row-gap", val + "em");
        });

        CELL_HEIGHT_INPUT.addEventListener("change", (event) => {
            let val = CELL_HEIGHT_INPUT.value;
            ROOT.style.setProperty("--cell-height", val + "em");
        });

        EXCLUDE_FIRST_ROW_CHECKBOX.addEventListener("change", (event) => {
            toggleFirstRowVisibility();
        });

        /*

        AUTO_SCROLL_CHECKBOX.addEventListener("change", (event) => {
            autoScrollEnabled = AUTO_SCROLL_CHECKBOX.checked;
            setAutoScrollEnabledAttr(autoScrollEnabled);
        });

        REPETITIONS_INPUT.addEventListener("change", (event) => {
            let val = parseInt(REPETITIONS_INPUT.value);
            // TODO: no magics!
            if (val <= 0) val = 1;
            else if (val > 8) val = 8;

            barRepetitions = val;
        });

        PREAMBLE_BEATS_INPUT.addEventListener("change", (event) => {
            let val = parseInt(PREAMBLE_BEATS_INPUT.value);

            if (val < 0) val = 0;
            else if (val > 16) val = 16;

            metronome.preambleBeats = val;
        });

        PREAMBLE_CHECKBOX.addEventListener("change", (event) => {
            metronome.preambleEnabled = PREAMBLE_CHECKBOX.checked;
        });
        */

        const gridFormInstance = GenerateGridFormComponent();
        const metronomeFormInstance = MetronomeFormComponent();

        // TODO: Component-ize the other forms and add them to this.
        const controlPanelComponents = [
            {
                clazz: gridFormInstance,
                name: 'Grid',
                icon: ''
            },
            {
                clazz: metronomeFormInstance,
                name: 'Metronome',
                icon: ''
            }
        ];

        const controlPanelInstance = ControlPanelComponent({
            controlPanelComponents: controlPanelComponents
        });


        // TODO: add event listeners for keyboard inputs to change metronome
        // TODO: add facility to load in last saved settings etc.
        //
        createApp({
            get controlPanelInstance() {
                return controlPanelInstance
            }
        }).mount();
    }

    initialize();
})();
