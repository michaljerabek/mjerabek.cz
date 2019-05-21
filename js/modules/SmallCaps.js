/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.SmallCaps = (function () {

        var ATTR = {
                item: "data-small-caps"
            },

            SELECTOR = {
                items: "[" + ATTR.item + "='true']",
                lazyItems: "[" + ATTR.item + "='lazy']"
            },

            getAttr = function (state) {

                return ATTR.item + (state ? "=\"" + state.toString() + "\"" : "");
            },

            removeItem = function ($el) {

                return $el[0].removeAttribute(ATTR.item);
            },

            getState = function ($el) {

                var attr = $el[0].getAttribute(ATTR.item);

                return attr === "true" ? true: attr === "lazy" ? "lazy" : false;
            },

            execInit = function (selector) {

                var $items = $(document.querySelectorAll(selector));

                $items.smallCaps();
            },

            init = function () {

                if (typeof $.fn.smallCaps === "function") {

                    execInit(SELECTOR.items);

                    if (window.requestIdleCallback) {

                        window.requestIdleCallback(execInit.bind(this, SELECTOR.lazyItems));

                    } else {

                        setTimeout(execInit.bind(this, SELECTOR.lazyItems), 0);
                    }
                }
            };

        return {
            init: init,

            getState: getState,
            removeItem: removeItem,

            getAttr: getAttr
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
