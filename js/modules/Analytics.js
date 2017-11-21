/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, ga, window, document*/

(function (ns, $) {

    ns.Analytics = (function () {

        ns.$win = ns.$win || $(window);
        ns.$doc = ns.$doc || $(document);
        ns.$temp = ns.$temp || $([null]);

        var DATA = {
                eventClick: "analytics-event-click"
            },

            SELECTOR = {
                eventClick: "[data-" + DATA.eventClick + "]"
            },

            DATA_DELIMITER = "|",

            PAGE_VIEW_TIMEOUT = 3500,

            pageViewTimeout = null,

            pageExitInitialized = false,

            initPageExit = function () {

                ns.$win.on("unload." + ns, function () {

                    sendEvent("exit", "general", "Uživatel opustil stránku.");
                });
            },

            sendPageView = function (event, target) {

                clearTimeout(pageViewTimeout);

                pageViewTimeout = setTimeout(function() {

                    if (typeof window.ga === "function") {

                        ga("set", "page", "#" + target);
                        ga("send", "pageview");
                    }

                    if (!pageExitInitialized) {

                        initPageExit();

                        pageExitInitialized = true;
                    }
                }, PAGE_VIEW_TIMEOUT);
            },

            parseEventData = function (el) {

                ns.$temp[0] = el;

                var data = ns.$temp.data(DATA.eventClick),

                    dataArr = data ? data.split(DATA_DELIMITER) : [];

                return {
                    eventCategory: dataArr[0] || "unknown",
                    eventLabel: dataArr[1] || "unknown"
                };
            },

            sendEvent = function (action, elOrCategory, label) {

                if (typeof window.ga === "function") {

                    var data = typeof elOrCategory === "string" ? {} : parseEventData(elOrCategory);

                    data.hitType = "event";
                    data.eventAction = action || "unknown";

                    data.eventCategory = data.eventCategory || elOrCategory || "unknown";
                    data.eventLabel = data.eventLabel || label || "unknown";

                    ga("send", data);
                }
            },

            init = function () {

                ns.$win.on("main-nav__target-changed." + ns, sendPageView)
                    .on("technologies__changed." + ns, sendPageView);

                ns.$doc.on("click." + ns + " mouseup." + ns, SELECTOR.eventClick, function (event) {

                    if (event.type === "mouseup" && event.originalEvent.button !== 1) {

                        return;
                    }

                    sendEvent("click", event.currentTarget);
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
