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
class CookieUtils {
    /* ------------------ Statics ------------------ */
    static #EPOCH = new Date(0);
    static #YEAR_MILLISECONDS = (365 * 24 * 60 * 60 * 1000);

    /* ------------------ Getters ------------------ */
    static get EPOCH() { return this.#EPOCH; }
    static get YEAR_MILLISECONDS() { return this.#YEAR_MILLISECONDS; }

    /* ------------------ Functions ------------------ */
    /**
    * @param {string} cookieName
    * @param {string} value
    * @param {int|Date} lifetime in milliseconds (if an int), or a concrete expiry Date
    * @param {string} path
    * @param {object} otherOpts
    * @return {undefined}
    */
    static setCookie(cookieName, value, lifetime, path, otherOpts={}) {
        if (!cookieName) return;

        if (value === null || value === void(0)) {
            value = 'true';
        }

        let expiryDate = null;

        if (lifetime instanceof Date) {
            expiryDate = lifetime;
        }
        else {
            if (typeof lifetime !== 'number' || !isFinite(lifetime) || lifetime <= 0) {
                lifetime = this.#YEAR_MILLISECONDS;
            }
            else {
                lifetime = Math.floor(lifetime);	// ensure it's an integer
            }

            expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + lifetime);
        }

        if (!path) path = '/';

        const domain = otherOpts.domain || document.domain;
        const sameSite = otherOpts.sameSite || 'Strict';
        const secure = otherOpts.secure === undefined ? 'Secure' : (otherOpts.secure ? 'Secure': '');

        document.cookie = `${cookieName}=${value};expires=${expiryDate.toUTCString()};path=${path};` +
                            `domain=${domain};SameSite=${sameSite};${secure}'`;
    }

    /**
    * @param {string} cookieName
    * @return {any|null} - the value of the named cookie, or null if no cookie with that name was found
    */
    static getCookie(cookieName) {
        if (cookieName) {
            let crumbs = this.getCookies();
            for (var i = 0; i < crumbs.length; i++) {
                if (crumbs[i].match(cookieName+'=')) {
                    return crumbs[i].split('=')[1];
                }
            }
        }

        return null;
    }

    /**
    * @param {boolean} asObject - if true, the return value is an object of cookie names mapped to their values
    * @return {array|object} - either an array of simple strings ("key=value"), or an object (if `asObjects` is true)
    */
    static getCookies(asObject) {
        let cookies = decodeURIComponent(document.cookie).split(';').map(cookie => cookie.trim());

        if (!asObject) return cookies;

        let ret = {};

        cookies.forEach((cookieString, idx) => {
            let chunks = cookieString.split("=");
            ret[chunks[0]] = chunks[1];
        });

        return ret;
    }

    /**
     * TODO: also allow first arg to be a test function..?
    * @param {RegExp} regex - a RegExp used to capture the keys of cookies of interest
    * @param {boolean} asObject - if true, the return value is an object of cookie names mapped to their values
    * @return {array|object} - either an array of simple strings ("key=value"), an object (if `asObjects` is true)
    */
    static findCookies(regex, asObject) {
        // more convenient to work with the pre-split key=values of the object result of getCookies
        let allCookies = this.getCookies(true);

        let ret = {};

        for (const key in allCookies) {
            if (regex.test(key)) ret[key] = allCookies[key];
        }

        if (asObject) return ret;

        // change back to the array of key=value strings
        let arr = [];
        for (const key in allCookies) {
            arr.push(`${key}=${allCookies[key]}`);
        }

        return arr;
    }

    /**
    * The only way you can really delete a cookie is by setting its expiry to a point in the past
    * @param {...(string|RegExp)} cookieNames
    * @return {undefined}
    */
    static deleteCookies(...cookieNames) {
        let finalCookieNames = [];

        cookieNames.forEach((cookieName, i) => {
            if (cookieName instanceof RegExp) {
                Object.keys(this.findCookies(cookieName, true)).forEach((k, i) => {
                    finalCookieNames.push(k);
                });
            }
            else {
                finalCookieNames.push(cookieName);
            }
        });

        finalCookieNames.forEach((cookieName, i) => this.setCookie(cookieName, "", this.#EPOCH));
    }
};

/**
*
*
*/
class ConsentUtils {
    /* ------------------ Statics ------------------ */
    static #CONSENT_LEVEL_COOKIE_NAME = "drumComboDemo_siteConsentLevel";

    /**
    * This inner class is acting as an enum
    */
    static #Level = class {
        static get ONLY_FUNCTIONAL() { return 0; }
        static get FUNCTIONAL_AND_ANALYTICS() { return 1; }
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
        return CookieUtils.getCookie(this.#CONSENT_LEVEL_COOKIE_NAME);
    }
}

/**
*
*
*/
class AnalyticsUtils {
    /* ------------------ Statics ------------------ */
    static #GA4_MEASUREMENT_ID_REGEX = /^G-[A-Z0-9]{10}$/g;
    static #GA4_COOKIE_FIND_REGEX = /^_ga/;

    /* ------------------ Functions ------------------ */
    /**
    * @param {string} analyticsId
    * @return {undefined}
    */
    static setupAnalytics(analyticsId) {
        if (typeof window.gtag === 'function') {
            console.info("gtag already appears to be set up");
            return;
        }

        if (!this.#GA4_MEASUREMENT_ID_REGEX.test(analyticsId)) {
            console.error("That was a bad analytics ID!");
            return;
        }

        let script = document.createElement('script');
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + analyticsId;
        script.async = true;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){dataLayer.push(arguments);}
        window.gtag('js', new Date());

        // place restrictions on analytics cookies
        window.gtag('config', analyticsId, {
            'cookie_domain': document.domain,                           // prevent top-level domain usage
            'cookie_expires': CookieUtils.YEAR_MILLISECONDS / 1000,     // reduce lifetime to a year (seconds)
            'cookie_update': false,                                     // prevent the expiry date resetting on every page refresh
            'cookie_flags': 'SameSite=None;Secure'                      // be explicit with SameSite
        });

        // TODO: that GS flag is not respecting the cookie_update setting, but the GA one is.

        document.body.append(script);
    }

    /**
    *
    * @return {undefined}
    */
    static deleteAnalyticsCookies() {
        CookieUtils.deleteCookies(this.#GA4_COOKIE_FIND_REGEX);
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

    static get Analytics() {
        return AnalyticsUtils;
    }
}

export { SiteUtils };
