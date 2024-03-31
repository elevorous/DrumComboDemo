//import { CallbackMetronome } from "callback-metronome";
import { createApp } from "petite-vue-pro";
import { GenerateGridFormComponent } from "component.generate-grid-form";
import { ControlPanelComponent } from "component.control-panel";
import { MetronomeFormComponent } from "component.metronome-form";
import { AutoscrollFormComponent } from "component.autoscroll-form";

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
    // const BPM_INPUT = document.getElementById("bpm");
    // const METRONOME_TOGGLE_BUTTON = document.getElementById("metronomeToggleButton");
    // const BODY = document.getElementsByTagName("body")[0];
    // const AUTO_SCROLL_CHECKBOX = document.getElementById("enableAutoScroll");
    // const REPETITIONS_INPUT = document.getElementById("repetitions");
    // const BEATS_PER_BAR_INPUT = document.getElementById("beatsPerBar");
    // const PREAMBLE_BEATS_INPUT = document.getElementById("preambleBeats");
    // const PREAMBLE_CHECKBOX = document.getElementById("enablePreamble");

    const ROOT = document.documentElement;

    // TODO: source consts from the element attributes
    // const DEFAULT_BPM = 60;

    // const HTML_CACHE = {};

    // let currentVal = null;
    // let autoScrollEnabled = false;
    //let metronome = new CallbackMetronome(DEFAULT_BPM);
    // let currentVisibleRows = null;
    // let barRepetitions = 1;
    // let currentActiveVisibleRowIndex = 0;

    /**
    * @return {undefined}
    */
    function toggleFirstRowVisibility() {
        let firstRow = document.querySelector(".combination-wrapper:first-child");
        EXCLUDE_FIRST_ROW_CHECKBOX.checked ? firstRow.setAttribute("hidden", "") : firstRow.removeAttribute("hidden");
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


        const gridFormInstance = GenerateGridFormComponent();
        const metronomeFormInstance = MetronomeFormComponent();
        const autoscrollFormInstance = AutoscrollFormComponent();

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
            },
            {
                clazz: autoscrollFormInstance,
                name: 'Autoscroll',
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
