/**
*
* @author elevorous
*/

'use strict';

/**
*
*
*/
const MathUtils = {
    /**
    * @param {Number} value
    * @param {Number} min
    * @param {Number} max
    * @return {Number}
    */
    clamp: function(value, min, max) {
        return Math.min(Math.max(min, value), max);
    }
};

/**
*
*
*/
const CookieUtils = {
    /**
    *	@param {string} cookieName
    *	@param {string} value
    *	@param {number} lifetime in seconds
    *	@param {string} path
    *	@return {undefined}
    */
    setCookie: function(cookieName, value, lifetime, path) {
        if (!cookieName) return;

        if (value === null || value === void(0)) {
            value = 'true';
        }

        if (typeof lifetime !== 'number' || !isFinite(lifetime) || lifetime <= 0) {
            lifetime = (365 * 24 * 60 * 60 * 1000);		//a year
        }
        else {
            lifetime = Math.floor(lifetime);	// ensure it's an integer
        }

        if (!path) path = '/';

        let d = new Date();
        d.setTime(d.getTime() + lifetime);

        document.cookie = cookieName+'='+value+';expires='+d.toUTCString()+';path='+path;
    },

    /**
    *	@param {string} cookieName
    *	@return {boolean|null}
    */
    getCookie: function(cookieName) {
        if (cookieName) {
            let crumbs = decodeURIComponent(document.cookie).split(';');
            for (var i = 0; i < crumbs.length; i++) {
                if (crumbs[i].match(cookieName+'=')) {
                    return crumbs[i].split('=')[1];
                }
            }
        }

        return null;
    }
};

/**
*
*
*/
class ConsentUtils {
    /* ------------------ Fields ------------------ */
    static #CONSENT_LEVEL_COOKIE_NAME = "drumComboDemo_siteConsentLevel";

    /**
    * This inner class is acting as an enum
    */
    static #Level = class {
        static #ONLY_FUNCTIONAL = 0;
        static #FUNCTIONAL_AND_ANALYTICS = 1;

        static get ONLY_FUNCTIONAL() { return this.#ONLY_FUNCTIONAL; }
        static get FUNCTIONAL_AND_ANALYTICS() { return this.#FUNCTIONAL_AND_ANALYTICS; }
    }

    /* ------------------ Getters ------------------ */
    static get CONSENT_LEVEL_COOKIE_NAME() { return this.#CONSENT_LEVEL_COOKIE_NAME; }
    static get Level() { return this.#Level; }

    /* ------------------ Functions ------------------ */
    /**
    * @param {int} consentLevel
    * @return {undefined}
    */
    static setSiteConsentLevel(consentLevel) {
        CookieUtils.setCookie(this.#CONSENT_LEVEL_COOKIE_NAME, consentLevel);
    }

    /**
    *
    * @return {int|null}
    */
    static getSiteConsentLevel() {
        CookieUtils.getCookie(this.#CONSENT_LEVEL_COOKIE_NAME);
    }
}

/**
*
*
*/
class SiteUtils {
    static get Math() {
        return MathUtils;
    }

    static get Cookies() {
        return CookieUtils;
    }

    static get Consent() {
        return ConsentUtils;
    }
}

export { SiteUtils };
