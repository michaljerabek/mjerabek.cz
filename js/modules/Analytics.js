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

            CATEGORY = {
                FORM: "form",
                WEB: "web",
                SECTION: "sekce",
                REFERENCES: "reference"
            },

            DATA_DELIMITER = "|",

            PAGE_VIEW_TIMEOUT = 3000,

            VISIBILITY_DEBOUNCE = 2000,

            lastSection = (window.location.hash || "#uvod").replace("#", ""),
            lastSectionFrom = new Date(),

            lastSentSection = lastSection,

            hiddenFrom = document.hidden ? new Date() : null,

            visibilitychangeDebounce,
            visibilitychangeDebounceFn,

            sendPageViewDebounce,
            sendPageViewDebounceFn,

            pageExitInitialized = false,

            getHiddenTime = function (debounceTime) {

                return (((new Date() - debounceTime) - hiddenFrom) / 1000).toFixed(1);
            },

            getLastSectionTime = function () {

                return ((new Date() - lastSectionFrom) / 1000).toFixed(1);
            },

            clearPageView = function () {

                if (sendPageViewDebounceFn) {

                    clearTimeout(sendPageViewDebounce);

                    sendPageViewDebounceFn();
                }
            },

            clearVisibilitychange = function () {

                if (visibilitychangeDebounceFn) {

                    clearTimeout(visibilitychangeDebounce);

                    visibilitychangeDebounceFn();
                }
            },

            initPageExitTime = function () {

                ns.$win.on("unload." + ns, function () {

                    clearVisibilitychange();

                    sendEvent("exit", CATEGORY.WEB, "Poslední sekce: " + lastSection + "; " + getLastSectionTime() + "s.");
                });
            },

            sendSectionExit = function () {

                if (lastSentSection) {

                    if (lastSentSection.match(/^#?reference-/)) {

                        lastSentSection = "reference";
                    }

                    sendEvent("exit", CATEGORY.SECTION, "Sekce: " + lastSentSection + "; " + getLastSectionTime() + "s.", true);

                    lastSentSection = null;
                }
            },

            sendReferenceChange = function (event, target) {

                clearVisibilitychange();

                target = target.replace(/#?reference-/, "");

                sendEvent("change", CATEGORY.REFERENCES, "Reference: " + target);
            },

            sendPageView = function (event, target) {

                target = (target || window.location.hash || "").replace("#", "");

                if (target && target.match(/^reference-/)) {

                    target = "reference";
                }

                clearTimeout(sendPageViewDebounce);

                sendPageViewDebounceFn = function () {

                    clearVisibilitychange();

                    if (typeof window.ga === "function") {

                        ga("set", "page", "#" + target);
                        ga("send", "pageview");
                    }

                    if (!pageExitInitialized) {

                        initPageExitTime();

                        pageExitInitialized = true;
                    }

                    lastSentSection = target;

                    sendPageViewDebounceFn = null;
                };

                sendPageViewDebounce = setTimeout(sendPageViewDebounceFn, PAGE_VIEW_TIMEOUT);

                sendSectionExit();

                lastSection = target;
                lastSectionFrom = new Date();
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

            sendEvent = function (action, elOrCategory, label, skipClearPageView) {

                clearVisibilitychange();

                if (!skipClearPageView) {

                    clearPageView();
                }

                if (typeof window.ga === "function") {

                    var data = typeof elOrCategory === "string" ? {} : parseEventData(elOrCategory);

                    data.hitType = "event";
                    data.eventAction = action || "unknown";

                    data.eventCategory = data.eventCategory || elOrCategory || "unknown";
                    data.eventLabel = data.eventLabel || label || "unknown";

                    ga("send", data);
                }
            },

            onClick = function (event) {

                if (event.type === "mouseup" && event.originalEvent.button !== 1) {

                    return;
                }

                sendEvent("click", event.currentTarget);
            },

            onKeyup = function (event) {

                if (event.which === 123) {

                    sendEvent("F12", CATEGORY.WEB, "Developer Tools");
                }
            },

            onVisibilitychange = function () {

                if (!document.hidden) {

                    clearTimeout(visibilitychangeDebounce);

                    visibilitychangeDebounceFn = function() {

                        var debounceTime = new Date() - visibilitychangeDebounceFn.debounceStartTime;

                        visibilitychangeDebounceFn = null;

                        sendEvent("visibilitychange", CATEGORY.WEB, "Skrytý: " + getHiddenTime(debounceTime) + "s");
                    };

                    visibilitychangeDebounceFn.debounceStartTime = new Date();

                    visibilitychangeDebounce = setTimeout(visibilitychangeDebounceFn, VISIBILITY_DEBOUNCE);

                    return;
                }

                clearTimeout(visibilitychangeDebounce);

                if (!visibilitychangeDebounceFn) {

                    hiddenFrom = new Date();
                }

                visibilitychangeDebounceFn = null;
            },

            onFormSent = function () {

                sendEvent("sent", CATEGORY.FORM, "Odeslán formulář.");
            },

            init = function () {

                ns.$win.on([
                    "main-nav__target-changed." + ns,
                    "technologies__changed." + ns,
                    "technologies__closed." + ns
                ].join(" "), sendPageView);

                ns.$win.on("references__changed." + ns, sendReferenceChange);

                ns.$win.on("keyup." + ns, onKeyup);

                ns.$win.on("visibilitychange." + ns, onVisibilitychange);

                ns.$win.on("form__success." + ns, onFormSent);

                ns.$doc.on("click." + ns + " mouseup." + ns, SELECTOR.eventClick, onClick);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
