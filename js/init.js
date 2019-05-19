/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, window*/

jQuery(function () {

    if (!window.MJNS) {

        return;
    }

    var idleCallback = window.requestIdleCallback || function (fn) { return setTimeout(fn, 0); },

        NS = window.MJNS,

        modules = ["$BGObjectsOpacityAnimation", "Performance", "Visibility", "JSHover", "BreakText", "MainNav", "Intro", "SmallCaps", "Offer", "TechnologiesLoader", "References", "AboutMe", "Pricelist", "Form", "Contact", "Fonts", "Cookies", "FixBugs", "Analytics", "$ConsoleMessage"],
        asyncModulesToLoad = [
            "build/BGObjectsOpacityAnimation.build.min.js",
            "build/ConsoleMessage.build.min.js"
        ];

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

    jQuery(window).on("load", function () {

        var loader = function () {

            asyncModulesToLoad.forEach(function (src) {

                var elScript = document.createElement("script");

                if (NS.ENV.match(/^prod/i)) {

                    src += "?v=" + NS.VERSION;

                } else {

                    src = src.replace(/\.min\.js$/, ".js");
                }

                elScript.async = true;

                var loadFn = function () {

                    elScript.src = src;

                    document.body.appendChild(elScript);
                };

                idleCallback(loadFn);
            });
        };

        idleCallback(loader);
    });
});
