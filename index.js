/**
* Script should be at bottom of HTML body
*
* @author elevorous
*/

'use strict';

const EMPTY_VAL = 0;
const FILLED_VAL = 1;

const N_VALUE_INPUT = document.getElementById("nValue");
const ROW_GAP_INPUT = document.getElementById("rowGap");
const CELL_HEIGHT_INPUT = document.getElementById("cellHeight");
const RENDER_AREA_DIV = document.getElementById("renderArea");
const EXCLUDE_FIRST_ROW_CHECKBOX = document.getElementById("excludeFirstRow");

const ROOT = document.documentElement;

const HTML_CACHE = {};
let currentVal = null;

/**
*
*/
function onSubmit(event) {
    event.preventDefault();
    const val = parseInt(N_VALUE_INPUT.value);

    // do nothing, we're already showing the correct grid
    if (currentVal === val) return;

    // if we don't have this generated HTML in the cache, create it
    if (!HTML_CACHE[val]) {
        let combinations = generateCombinations2(val);
        combinations = sortCombinations(combinations);
        HTML_CACHE[val] = combinations.map((combo, i) => createCombinationsHTML(combo, i)).join('');
    }

    // the ul element .children.item(0)
    RENDER_AREA_DIV.innerHTML = HTML_CACHE[val];
    currentVal = val;
}

/**
*
*/
function createCombinationsHTML(combination, index) {
    const n = combination.length;
    return  `<div class="combination-wrapper">
                <div>${index}</div>
                <div class="combination" data-value="${combination}">
                    ${[...combination].map(i => `<div data-bit="${i}"></div>`).join('')}
                </div>
            </div>`;
}

/**
*
*/
function generateCombinations2(n) {
    const totalCombinations = Math.pow(2, n);
    let combinations = new Array(totalCombinations);

    for (let i = 0; i < combinations.length; i++) {
        let bitString = i.toString(2);
        combinations[i] = bitString.padStart(n, 0);
    }

    return combinations;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log
// function getBaseLog(x, y) {
//     return Math.log(y) / Math.log(x);
// }

// don't know what I'm doing here.. this doesn't work.
// function countPositiveBits(value, n) {
//     if (!value || !n) return 0;
//     if (value === 1) return 1;
//
//     let bitCount = 0;
//     const power = Math.pow(2, n);
//
//     let remainder = value % power;
//     if (!remainder) {
//         bitCount = 1;
//     }
//     else {
//         bitCount += countPositiveBits(remainder, n - 1);
//     }
//
//     return bitCount;
// }

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
* TODO
*/
function sortCombinations(combinations) {
    // split combinations up into counts of bits
    let bitGroupings = [];

    combinations.forEach((item, i) => {
        // I;m sure there must be some mathematical / modulo based way of determining the number of bits a number would
        // have in its binary representation.
        // let bitCount = countPositiveBits(i, n);

        // simplest solution would be replace all 0 with "", and then assess the legnth of the resulting string.
        let bitCount = item.replaceAll("0", "").length;

        if (!bitGroupings[bitCount]) bitGroupings[bitCount] = [];
        bitGroupings[bitCount].unshift(item);
    });

    let ret = [];

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
                        let aNum = parseInt(a, 2);
                        let bNum = parseInt(b, 2);

                        // this sort of works for the 2 bitCount numbers in n=5, but not the 3 bitCount numbers :/
                        // if (aNum > bNum) {
                        //     if (aNum % bNum === 0) return -1;
                        //     return (aNum - bNum) < Math.floor((bNum / 2)) ? -1 : 1;
                        // }
                        // else {
                        //     if (bNum % aNum === 0) return 1;
                        //     return (bNum - aNum) < Math.floor((aNum / 2)) ? 1 : -1;
                        // }

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

    return ret;
}

// Initialize
(function() {
    ROW_GAP_INPUT.addEventListener("change", (event) => {
        let val = ROW_GAP_INPUT.value;
        ROOT.style.setProperty("--row-gap", val + "em");
    });

    CELL_HEIGHT_INPUT.addEventListener("change", (event) => {
        let val = CELL_HEIGHT_INPUT.value;
        ROOT.style.setProperty("--cell-height", val + "em");
    });

    EXCLUDE_FIRST_ROW_CHECKBOX.addEventListener("change", (event) => {
        RENDER_AREA_DIV.className = EXCLUDE_FIRST_ROW_CHECKBOX.checked ? "first-row-hidden" : "";
    });
})();

/*
* ========================================================================================================================
* ======================================================== unused ========================================================
* ========================================================================================================================
*/

/**
*
* @param {int} n
*/
function generateCombinations(n) {
    const totalCombinations = Math.pow(2, n);
    let combinations = new Array(totalCombinations);

    // Couple of interesting lessons learned:
    // 1. Array.fill, when given an object, will fill the array with
    //      references to that same single object, NOT create a new object
    //      instance for each index.
    // 2. Arrays which have empty (sparse) elements will not include them
    //      in iterative calls like Array.forEach, Array.map, etc.
    for (let i = 0; i < combinations.length; i++) {
        combinations[i] = new Array(n);
    }

    // what you actually have here is a numeric sequence of binary numbers!
    // e.g. [[0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1]]
    combinations = fillCombinations(combinations);

    return combinations;
}

/**
* @recursive
*
* @param {int[][]} combinations - an array of integer arrays (each initally filled with undefined values),
*                                   which will be populated recursively with 1s and 0s.
* @param {int} applyToIndex - the index of this integer arrays on which this recursion will write to.
*/
function fillCombinations(combinations, applyToIndex) {
    let ret = [];

    if (combinations) {
        // we cannot get a left/right split, so just return
        if (combinations.length == 1) {
            ret = combinations;
        }
        else {
            applyToIndex = applyToIndex || 0;

            const midpoint = combinations.length / 2;
            let left = combinations.slice(0, midpoint);
            let right = combinations.slice(midpoint, combinations.length);

            left.forEach(combination => combination[applyToIndex] = EMPTY_VAL);
            right.forEach(combination => combination[applyToIndex] = FILLED_VAL);

            left = fillCombinations(left, applyToIndex + 1);
            right = fillCombinations(right, applyToIndex + 1);

            ret = left.concat(right);
        }
    }

    return ret;
}
