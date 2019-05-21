/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns, $) {

    ns.$ParallaxLoader = ns.$ParallaxLoader || $.Deferred();

    if (window.requestIdleCallback) {

        window.requestIdleCallback(ns.$ParallaxLoader.resolve);

    } else {

        setTimeout(ns.$ParallaxLoader.resolve, 0);
    }

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
