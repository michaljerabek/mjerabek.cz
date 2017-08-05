/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.SmallCaps = (function () {

        var ATTR = {
                item: "data-small-caps"
            },

            SELECTOR = {
                items: "[" + ATTR.item + "='true']"
            },

            getAttr = function (state) {

                return ATTR.item + ( typeof state === "boolean" ? "=\"" + state.toString() + "\"" : "");
            },

            removeItem = function ($el) {

                return $el[0].removeAttribute(ATTR.item);
            },

            isItem = function ($el) {

                return !!$el[0].getAttribute(ATTR.item);
            },

            init = function () {

                if (typeof $.fn.smallCaps === "function") {

                    var items = document.querySelectorAll(SELECTOR.items);

                    $(items).smallCaps();
                }
            };

        return {
            init: init,

            isItem: isItem,
            removeItem: removeItem,

            getAttr: getAttr
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
