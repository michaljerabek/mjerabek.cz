/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, window, setTimeout*/

jQuery(function () {

    if (!window.MJNS) {

        return;
    }

    var modules = ["Performance", "JSHover", "BreakText", "BGObjectsOpacityAnimation", "MainNav", "Intro", "SmallCaps", "Offer", "Technologies", "References", "AboutMe", "Pricelist", "Form", "Contact", "Fonts", "Cookies", "FixBugs", "Analytics", "ConsoleMessage:2000"];

    modules.forEach(function (moduleSettings) {

        var settings = moduleSettings.split(":"),

            moduleName = settings[0],
            delayLoad = !isNaN(parseInt(settings[1])) ? parseInt(settings[1]): null;

        if (window.MJNS[moduleName] && typeof window.MJNS[moduleName].init === "function") {

            if (typeof delayLoad === "number") {

                setTimeout(window.MJNS[moduleName].init, delayLoad);

            } else {

                window.MJNS[moduleName].init();
            }
        }
    });
});
