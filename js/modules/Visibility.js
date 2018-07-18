/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);

    ns.Visibility = (function () {

        var CLASS = {
                wasVisible: "was-visible"
            },

            markAsWasVisible = function () {

                if (!document.hidden) {

                    ns.$temp[0] = document.documentElement;

                    ns.$temp.addClass(CLASS.wasVisible);

                    document.removeEventListener("visibilitychange", markAsWasVisible);
                }
            },

            init = function () {

                if (document.visibilityState) {

                    if (!document.hidden) {

                        markAsWasVisible();

                        return;
                    }

                    document.addEventListener("visibilitychange", markAsWasVisible);
                }
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
