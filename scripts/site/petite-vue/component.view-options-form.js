/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/component.view-options-form.js"></script>
*
* USAGE:
*   import { ViewOptionsFormComponent } from "component.view-options-form";
*
* @author elevorous
*/

'use strict';

import { SiteUtils } from "site-utils";
import { mixin__PageManagerAware } from "page-manager";


/**
* @Component
* A petite-vue Component representing
*
* @see /templates/site/petite-vue/view-options-form.html
*
* @param {object} props - an object possessing variables passed in from an instantiation of this Component
* @return {object} - a ViewOptionsFormComponent instance
*/
export function ViewOptionsFormComponent(props) {
    const ROOT = document.documentElement;

    /**
     *  Okay, after a lot of backwards and forwards exploring my options, I've decided to keep things straightforward
     *      when it comes to constructing these component objects.
     *  Using classes would have been far more preferable, but petite-vue-pro just doesn't appear to support any
     *      kind of object where its properties are not directly its own properties - so for instance, properties on
     *      an object's prototype or constructor can't be extrapolated.
     *  Additionally, getters and setters on classes (i.e. assigned to the protoype), aren't enumerable, unlike getters
     *      and setters on plain objects. Statics are also a pain to refer to, as they are assigned to the constructor
     *      function, and you need to refer to them by the class name, or via the constructor of an instance, e.g.
     *      `myInstance.constructor.MY_STATIC`
     *
     *  So, we're in a position where we don't have the ability to privatise or static-ise fields, nor do we have
     *      the ability to inherit properties from a common ancestor by assigning to the prototype.
     *  On the former, we could define private and const fields within the context of this ViewOptionsFormComponent
     *      function here, and then get/set them from the returned component object. It requires a little more
     *      legwork in that we need to explicitly make private fields reactive(), but it's a viable option.
     *  On the latter, inheritance might not be on the cards, but a mixin would achieve what's needed for the particular
     *      use case here, in giving multiple component objects the `manager` set of properties and functions.
     *
     *  Another potential option *is* to use a class, but assign an instance of that class to the component object,
     *      and manipulate that. However, I'm not convinced that petite-vue-pro's reactivity on that instance would
     *      watch for changes on the properties of that instance, especially since you'd still have that issue of
     *      prototype and constructor properties not being directly findable on the instance.
     */

    let component = {
        $template: '#view-options-form-component-template',

        /* ------------------ "Static" ------------------ */
        get MIN_CELL_HEIGHT() { return 2; },
        get MAX_CELL_HEIGHT() { return 6; },
        get MIN_ROW_GAP() { return 0; },
        get MAX_ROW_GAP() { return 3; },

        /* ------------------ Fields ------------------ */
        _hideEmptyRow: true,
        _rowGap: 0,
        _cellHeight: 3,

        /* ------------------ Getters ------------------ */
        get hideEmptyRow() { return this._hideEmptyRow; },
        get rowGap() { return this._rowGap; },
        get cellHeight() { return this._cellHeight; },

        /* ------------------ Setters ------------------ */
        set hideEmptyRow(value) {
            // TODO: needs testing!
            this._hideEmptyRow = value;
            this.updateManager({'hideEmptyRow': this._hideEmptyRow});
        },

        set rowGap(value) {
            this._rowGap = SiteUtils.Math.clamp(value, this.MIN_ROW_GAP, this.MAX_ROW_GAP);
            // ROOT.style.setProperty("--row-gap", val + "em");
        },

        set cellHeight(value) {
            this._cellHeight = SiteUtils.Math.clamp(value, this.MIN_CELL_HEIGHT, this.MAX_CELL_HEIGHT);
            // ROOT.style.setProperty("--cell-height", val + "em");
        }
    };

    return mixin__PageManagerAware(component);
}
