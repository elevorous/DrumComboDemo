/**
*
* @author elevorous
*/

(function() {
    'use strict';

    const N_VALUE_INPUT = document.getElementById("nValue");
    const ROW_GAP_INPUT = document.getElementById("rowGap");
    const CELL_HEIGHT_INPUT = document.getElementById("cellHeight");
    const RENDER_AREA_DIV = document.getElementById("renderArea");
    const EXCLUDE_FIRST_ROW_CHECKBOX = document.getElementById("excludeFirstRow");
    const BPM_INPUT = document.getElementById("bpm");
    const METRONOME_TOGGLE_BUTTON = document.getElementById("metronomeToggleButton");
    const BODY = document.getElementsByTagName("body")[0];
    const AUTO_SCROLL_CHECKBOX = document.getElementById("enableAutoScroll");
    const REPETITIONS_INPUT = document.getElementById("repetitions");

    const ROOT = document.documentElement;

    // TODO: source consts from the element attributes
    const DEFAULT_BPM = 60;
    const MIN_BPM = 20;
    const MAX_BPM = 280;

    const HTML_CACHE = {};

    let currentVal = null;
    let autoScrollEnabled = false;
    let metronome = new CallbackMetronome(DEFAULT_BPM, doOnTick);
    let currentVisibleRows = null;
    let barRepetitions = 1;
    let currentActiveVisibleRowIndex = 0;

    function setAutoScrollEnabledAttr(value) {
        BODY.setAttribute("data-auto-scroll-enabled", value);
    }

    function setMetronomeRunningAttr(value) {
        BODY.setAttribute("data-metronome-running", value);
    }

    /**
    * @param {object} event - the onsubmit event
    */
    function generateGrid(event) {
        event.preventDefault();
        const val = parseInt(N_VALUE_INPUT.value);

        // do nothing, we're already showing the correct grid
        if (currentVal === val) return;

        // if we don't have this generated HTML in the cache, create it
        if (!HTML_CACHE[val]) {
            let combinations = generateCombinations(val);
            combinations = sortCombinations(combinations);
            HTML_CACHE[val] = combinations.map((combo, i) => createCombinationHTML(combo, i)).join('');
        }

        RENDER_AREA_DIV.innerHTML = HTML_CACHE[val];
        currentVal = val;
        metronome.beatsPerBar = currentVal;

        toggleFirstRowVisibility();
    }

    /**
    * @param {string} combination - a string value of a binary representation of a number
    * @param {int} index - the numeric index to mark this combination as
    * @return {string} - the string output for a HTML structure representing the given combination
    */
    function createCombinationHTML(combination, index) {
        const n = combination.length;
        return  `<div class="combination-wrapper">
                    <div>${index}</div>
                    <div class="combination" data-value="${combination}">
                        ${[...combination].map(i => `<div data-bit="${i}"></div>`).join('')}
                    </div>
                </div>`;
    }

    /**
    * @param {int} n
    * @return {string[]} - an array of strings, which are the binary representations of
    *                       0 through to 2^n
    */
    function generateCombinations(n) {
        const totalCombinations = Math.pow(2, n);
        let combinations = new Array(totalCombinations);

        for (let i = 0; i < combinations.length; i++) {
            let bitString = i.toString(2);
            combinations[i] = bitString.padStart(n, 0);
        }

        return combinations;
    }

    /**
    * @recursive
    *
    * @param {int} value
    * @return {int} the lowest odd-number factor of `value` which is NOT 1, unless
    *               `value` is 2 or less (in which case 1 can be the only answer)
    */
    function getLowestUnsplittableFactor(value) {
        if (value <= 2) return 1;
        if (value % 2 == 1) return value;
        return getLowestUnsplittableFactor(value / 2);
    }

    /**
    * Will sort the given array of combinations according to the following rules:
    *   1. Combinations are foremost grouped according to how many "positive" (1) bits
    *       they have in them. These "bitCount" groups are sorted in ascending fashion.
    *   2. Combinations which have all their positive bits in one contiguous group come first, ordered
    *       from highest to lowest value.
    *   3. Combinations with split groups which can be considered "wraparounds" of contiguous groups
    *       come next, i.e. 100011, 1101, 1100111. These are ordered lowest to highest value.
    *   4. Combinations with split non-wraparound groups come last. These are ordered according
    *       to their lowest odd factor > 1. Reasoning explained in code comments below.
    *
    *
    * @param {string[]} combinations - an array of strings representing binary numbers
    */
    function sortCombinations(combinations) {
        // phase 1: split combinations up into counts of bits
        let bitGroupings = [];

        combinations.forEach((item, i) => {
            // I;m sure there must be some mathematical / modulo based way of determining the number of bits a number would
            // have in its binary representation.
            // let bitCount = countPositiveBits(i, n);

            // simplest solution would be replace all 0 with "", and then assess the legnth of the resulting string.
            let bitCount = item.replaceAll("0", "").length;

            if (!bitGroupings[bitCount]) bitGroupings[bitCount] = [];
            // we add to the front of the array, so we're creating a natural sorted order of highest to lowest
            //  value in each bitCount array
            bitGroupings[bitCount].unshift(item);
        });

        let ret = [];

        // phase 2: do the sorting
        bitGroupings.forEach((groupArray, bitCount) => {
            // bitcounts of 0, 1 and n will already have been constructed in the right order.
            if (bitCount > 1 && bitCount < bitGroupings.length - 1) {
                const subStr = "1".repeat(bitCount);

                /**
                 * a > b, 1
                 * a < b, -1
                 * a == b, 0
                 */
                groupArray.sort((a, b) => {
                    if (a === b) return 0;

                    let aGrouped = a.indexOf(subStr) >= 0;
                    let bGrouped = b.indexOf(subStr) >= 0;

                    // we concatenate the string to itself so that we can check for combinations
                    // in which the contiguous group has wrapped around to the beginning
                    let aGroupWrapped = !aGrouped && (a + a).indexOf(subStr) >= 0;
                    let bGroupWrapped = !bGrouped && (b + b).indexOf(subStr) >= 0;


                    if (aGrouped && bGrouped) {
                        return a > b ? -1 : 1;
                    }
                    if (!aGrouped && !bGrouped) {
                        if (aGroupWrapped && bGroupWrapped) {
                            // if both are groupWrapped, we want the smaller value (the one with fewer 1s at the start) to
                            // come first, hence the swapped ternary result
                            return a > b ? 1 : -1;
                        }
                        else if (!aGroupWrapped && !bGroupWrapped) {
                            /**
                            * This is the most interesting case, best illustrated with an example.
                            *
                            * Let n = 5, bitCount = 3
                            * At the end of phase 1, you have this:
                            *   ["11100", "11010", "11001", "10110", "10101", "10011", "01110", "01101", "01011", "00111"]
                            *
                            * Indexes 0, 6, 9 are taken care of by the grouped case.
                            * Indexes 2 and 5 are dealt with by the wraparound case.
                            * That leaves:
                            *   ["11010", "10110", "10101","01101", "01011"]
                            * which in decimal is:
                            *   [26, 22, 21, 13, 11]
                            *
                            * We want this order, where we have the pattern with the fewest positive bits at the beginning
                            *   shifting along until we exhaust it, then the pattern with the next fewest positive bits at
                            *   the beginning shifting along, then the third next and so on, with any equally-spaced
                            *   non-shifting pattern coming last. E.g:
                            *       ["10110", "01011", "11010", "01101", "10101"]
                            *   or
                            *       [22, 11, 26, 13, 21]
                            *
                            * Now, the act of shifting all bits one place to the right is just a matter of halving, and you can
                            *   see that pattern in the decimal representation.
                            * What's less obvious is determining the order in which these smaller orderings of halves need to
                            *   go in. But, if you take a look at the last element in each of these sub-orders, (which will
                            *   always be an odd number) you'll notice that they *increase*:
                            *       [22, *11*, 26, *13*, *21*]
                            *
                            * This is the crux of this case. Take another example, where n=5, bitCount=2:
                            *       [..., 20, 10, *5*, 18, *9*]
                            */

                            let aNum = parseInt(a, 2);
                            let bNum = parseInt(b, 2);

                            // if a or b is a factor of the other, we can skip comparing unsplittable factors (since
                            //  they'll be the same), e.g. 20 vs 10 (both devolve to 5)
                            if ((aNum > bNum) && (aNum % bNum === 0)) {
                                return -1;
                            }
                            else if ((bNum > aNum) && (bNum % aNum === 0)) {
                                return 1;
                            }

                            return (getLowestUnsplittableFactor(aNum) < getLowestUnsplittableFactor(bNum)) ? -1 : 1;
                        }

                        return aGroupWrapped ? -1 : 1;
                    }
                    else {
                        return aGrouped ? -1 : 1;
                    }
                });
            }

            ret = ret.concat([...groupArray]);
        });

        console.log(bitGroupings);
        // for debugging
        window.currentBitGroupings = bitGroupings;

        return ret;
    }

    /**
    * Start/stop the metronome
    * @return {undefined}
    */
    function toggleMetronome(event) {
        event.preventDefault();

        if (metronome.isRunning) {
            stopMetronome();
        }
        else {
            startMetronome();
        }
    }

    function startMetronome() {
        METRONOME_TOGGLE_BUTTON.textContent = "Stop";
        setMetronomeRunningAttr(true);
        autoScrollEnabled && startAutoScroll();
        metronome.start();
    }

    function stopMetronome() {
        metronome.stop();
        METRONOME_TOGGLE_BUTTON.textContent = "Start";
        autoScrollEnabled && stopAutoScroll();
        setMetronomeRunningAttr(false);
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

        BPM_INPUT.addEventListener("change", (event) => {
            // not a great deal of validation. but this is just a simple tool, so w/e
            let bpmValue = parseInt(BPM_INPUT.value);
            if (bpmValue < MIN_BPM) bpmValue = MIN_BPM;
            else if (bpmValue > MAX_BPM) bpmValue = MAX_BPM;

            metronome.tempo = bpmValue;
        });

        AUTO_SCROLL_CHECKBOX.addEventListener("change", (event) => {
            autoScrollEnabled = AUTO_SCROLL_CHECKBOX.checked;
            setAutoScrollEnabledAttr(autoScrollEnabled);
        });

        REPETITIONS_INPUT.addEventListener("change", (event) => {
            let val = parseInt(REPETITIONS_INPUT.value);
            // TODO: no magics!
            if (val <= 0) val = 1;
            else if (val >= 8) val = 8;

            barRepetitions = val;
        })

        // TODO: add event listeners for keyboard inputs to change metronome
        // TODO: add facility to load in last saved settings etc.
    }

    // make functions available to DOM
    window.generateGrid = generateGrid;
    window.toggleMetronome = toggleMetronome;

    initialize();
})();
