/**
* INCLUDE:
*   <script type="module" src="scripts/site/module/combination-generator.js"></script>
*
* USAGE:
*   import { CombinationGeneratorService } from "combination-generator";
*
* @author elevorous
*/


/**
* A static service class for generating combinations of 1s and 0s, and sorting them to a very particular criteria
*
* @author elevorous
*/
class CombinationGeneratorService {

    /**
    * @param {int} nValue
    * @return {string[]} - an array of strings, which are the binary representations of 0 through to 2^n
    */
    static generateCombinations(nValue) {
        const totalCombinations = Math.pow(2, nValue);
        let combinations = new Array(totalCombinations);

        for (let i = 0; i < combinations.length; i++) {
            let bitString = i.toString(2);
            combinations[i] = bitString.padStart(nValue, 0);
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
    static getLowestUnsplittableFactor(value) {
        if (value <= 2) return 1;
        if (value % 2 == 1) return value;
        return getLowestUnsplittableFactor(value / 2);
    }

    /**
     * @param {string[]} combinations - an array of strings representing binary numbers (bitString)
     * @return {string[][]} - an array of bitString arrays, such that for the bitString array at index i, all the
     *                          bitStrings within that array will have i number of positive bits (1s) in them.
     *                          Each of the bitString arrays is sorted from highest to lowest numeric value.
     */
    static toBitGroupings(combinations) {
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

        return bitGroupings;
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
    * @return {string[]} - a new sorted array of strings
    */
    static sortCombinations(combinations) {
        // phase 1: split combinations up into counts of bits
        let bitGroupings = CombinationGeneratorService.toBitGroupings(combinations);

        let ret = [];

        // phase 2: do the sorting (this mutates the bitString arrays within bitGroupings!)
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

                            return (CombinationGeneratorService.getLowestUnsplittableFactor(aNum) <
                                    CombinationGeneratorService.getLowestUnsplittableFactor(bNum)) ? -1 : 1;
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
}

export { CombinationGeneratorService };
