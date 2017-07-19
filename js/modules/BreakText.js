/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.BreakText = (function () {

        var SELECTOR = {
                items: "[data-break-text='true']"
            },

            $temp = $([null]),

            wrapLetter = function (letter, smallCaps) {

                var attrs = [
                    "style=\"display: inline-block;", letter.match(/\s/) ? "white-space: pre;\"" : "\"",
                    smallCaps ? ns.SmallCaps.getAttr(true) : ""
                ].join("");

                return "<span " + attrs + ">" + letter + "</span>";
            },

            breakText = function (item) {

                $temp[0] = item;

                var text = $temp.text(),
                    hasSmallCaps = ns.SmallCaps.isItem($temp),

                    l = 0,
                    newText = [];

                for (l; l < text.length; l++) {

                    newText.push(wrapLetter(text[l], hasSmallCaps));
                }

                if (hasSmallCaps) {

                    ns.SmallCaps.removeItem($temp);
                }

                $temp.html(newText.join(""));
            },

            init = function () {

                $(SELECTOR.items).each(function (i, item) {

                    breakText(item);
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
