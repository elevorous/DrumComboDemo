/**
* INCLUDE:
*   <script type="module" src="scripts/site/petite-vue/page-manager.js"></script>
*
* USAGE:
*   import { PageManager, mixin__PageManagerAware } from "page-manager";
*
* @author elevorous
*/

'use strict';

import { reactive } from "petite-vue-pro";

/**
* A petite-vue
*
* @return {object} - a new reactive Vue object which will serve as a global manager for the application
*/
function PageManager() {
    return reactive({
        currentCombinations: null,
        hideEmptyRow: true,
    });
}

/**
*
*
*/
function _registerManager(manager) {
    this._manager = manager;
    return this.syncWithManager();
}

/**
*
*
*/
function _updateManager(updateMap) {
    if (this._manager && updateMap) {
        for (const key in updateMap) {
            this._manager[key] = updateMap[key];
        }
        console.log(this._manager);
    }
    return this;
}

/**
*
*
*/
function _syncWithManager() {
    // TODO
    console.log("TODO: sync!");
    return this;
}

/**
* Might move this mixin stuff elsewhere idk
*
* @param {object} o
* @return {object} o
*/
function mixin__PageManagerAware(o) {
    Object.defineProperties(o, {
        /* ------------------ Fields ------------------ */
        "_manager": {
            enumerable: true,
            value: reactive(null),
            writable: true,
            configurable: true
        },
        /* ------------------ Getters ------------------ */
        "isPageManagerAware": {
            enumerable: true,
            get: () => true,
            set: undefined,
            configurable: true
        },
        /* ------------------ Functions ------------------ */
        "registerManager": {
            enumerable: true,
            value: _registerManager.bind(o),
            writable: true,
            configurable: true
        },
        "updateManager": {
            enumerable: true,
            value: _updateManager.bind(o),
            writable: true,
            configurable: true
        },
        "syncWithManager": {
            enumerable: true,
            value: _syncWithManager.bind(o),
            writable: true,
            configurable: true
        }
    });

    return o;
}

export { PageManager, mixin__PageManagerAware };
