/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, window*/

(function() {

    if (!window.MJNS) {

        return;
    }

    var NS = window.MJNS,
        PROD = NS.ENV.match(/^prod/i);

    jQuery(window).on("load", function () {

        var idleCallback = window.requestIdleCallback || function (fn) { return setTimeout(fn, 0); },

            scriptsToLoad = [
                PROD ? "build/background.build.min.js?v=" + NS.VERSION: null,
                PROD ? "build/ConsoleMessage.build.min.js?v=" + NS.VERSION: "js/modules/ConsoleMessage.js"
            ].filter(function (src) { return src; });

        idleCallback(function () {

            scriptsToLoad.forEach(function (src) {

                idleCallback(function () {

                    var elScript = document.createElement("script");

                    elScript.async = true;
                    elScript.src = src;

                    document.body.appendChild(elScript);
                });
            });
        });
    });

    jQuery(function () {

        var modules = ["$ParallaxLoader", "$BGObjectsOpacityAnimation", "$OfferFeaturesAnimations", "CustomScrollbarLoader", "Performance", "Visibility", "JSHover", "BreakText", "Intro", "SmallCaps", "Offer", "TechnologiesLoader", "References", "AboutMe", "Pricelist", "Form", "Contact", "Fonts", "FixBugs", "$ConsoleMessage", "MainNav"];

        modules.forEach(function (moduleName) {

            moduleName = moduleName || "";

            if (NS[moduleName] && typeof NS[moduleName].init === "function") {

                NS[moduleName].init();

            } else if ((NS[moduleName] && typeof NS[moduleName].then === "function") || moduleName.indexOf("$") === 0) {

                if (!NS[moduleName]) {

                    NS[moduleName] = jQuery.Deferred();
                }

                NS[moduleName].then(function () {

                    moduleName = moduleName.replace(/^\$/, "");

                    if (NS[moduleName] && typeof NS[moduleName].init === "function") {

                        NS[moduleName].init();
                    }
                });
            }
        });
    });
}());
