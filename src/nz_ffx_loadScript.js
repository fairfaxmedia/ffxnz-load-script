;
/**
 * This is a script loader which is useful for controlling the dynamic loading of
 * scripts. It provides the following features:
 * - easy one-time dynamic loading of scripts
 * - returns a promise representing whether the scripts has loaded
 * - control over whether scripts being concurrently loaded are executed in the order
 *   loaded, or are executed as soon as available.
 * Inspired by the Filament Group's work on script loading: https://github.com/filamentgroup/loadJS
 */

(function(window) {
    'use strict';

    // Create an array for storing our script promises.
    var scriptsLoaded = [];

    /**
     * Load the supplied script URL, returing a promise.
     * If instructed, load the script asynchronously, otherwise load the script
     * synchronously. Note that synchronous means that the script will still be
     * loaded asynchronously, but execution will happen synchronously in the order
     * that the scripts were loaded.
     * Refer: http://www.html5rocks.com/en/tutorials/speed/script-loading/
     * @param  {string} url     The script URL to load
     * @param  {Boolean} async  A Boolean indicating whether we want to execute
     *                          the script asynchronously.
     *                          Defaults to null, effectively meaning async loading
     *                          but synchronous execution.
     * @return {Promise}        The promise representing whether the script has loaded.
     */
    function _loadScript(url, async) {
        var scriptPromise = new window.Promise(function(resolve, reject) {
            var head = window.document.getElementsByTagName('head')[0];

            // Create a new script tag
            var script = document.createElement('script');

            // Use the url argument as source attribute
            script.src = url;

            // If we want scripts to execute synchronously (though loaded asynchronously),
            // then set async to a falsey value.
            // If set to a truthy value, scripts will still be both loaded and executed async.
            script.async = async;

            // Call resolve when it’s loaded
            if (script.addEventListener) {
                script.addEventListener('load', function() {
                    resolve(url);
                }, false);
            } else {
                script.attachEvent('load', function() {
                    resolve(url);
                });
            }

            // Reject the promise if there’s an error
            if (script.addEventListener) {
                script.addEventListener('error', function() {
                    reject(url);
                }, false);
            } else {
                script.attachEvent('error', function() {
                    reject(url);
                });
            }

            head.appendChild(script);
        });

        // Add our script to the scriptsLoaded array so other parts of the application
        // can determine whether a given script url is / has been script loaded.
        scriptsLoaded.push({
            url: url,
            promise: scriptPromise,
        })

        return scriptPromise;
    }

    /**
     * Return the promise of the supplied script URL.
     * If the script URL has not already been loaded, force the load.
     * @param  {string} url      A script URL
     * @param  {Boolean} async   A Boolean indicating whether we want to execute
     *                           the script asynchronously.
     *                           Defaults to null, meaning async execution.
     * @return {Promise}         The promise representing whether the script has loaded.
     */
    var ffxnzLoadScript = function(url, async) {
        var promise;

        var scripts = scriptsLoaded.filter(function(item) {
            return item.url === url;
        });

        if (scripts.length) {
            promise = scripts[0].promise;
        } else {
            // Our script hasn't been previously requested for load, so let's load it.
            promise = _loadScript(url, async);
        }

        return promise;
    }

    if (typeof module !== 'undefined' && module.exports) {
        // commonjs
        exports = module.exports = ffxnzLoadScript;
    } else {
        // browserland
        window.nz = window.nz || {};
        window.nz.ffx = window.nz.ffx || {};
        window.nz.ffx.loadScript = ffxnzLoadScript;
        window.nz.ffx.scriptsLoaded = scriptsLoaded;
    }

}(typeof global !== 'undefined' ? global : this))
