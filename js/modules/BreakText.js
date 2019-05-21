/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);

    ns.BreakText = (function () {

        var CLASS = {
                word: "word",
                letter: "letter",
                space: "space"
            },

            SELECTOR = {
                items: "[data-break-text='true']",
                lazyItems: "[data-break-text='lazy']"
            },

            wrapLetter = function (letter, num, smallCaps) {

                var attrs = [
                        "class=\"", CLASS.letter + num, "\" style=\"display: inline-block;\"",
                        smallCaps ? ns.SmallCaps.getAttr(smallCaps) : ""
                    ].join(" ");

                return "<span " + attrs + ">" + letter + "</span>";
            },

            getWhiteSpace = function (num) {

                return "<span class=\"" + (CLASS.space + num) + "\"> </span>";
            },

            breakWord = function (word, num, hasSmallCaps) {

                var wordData = [],
                    l = 0;

                wordData.push("<span class=\"" + (CLASS.word + num) + "\" style=\"display: inline-block;\">");

                for (l; l < word.length; l++) {

                    wordData.push(wrapLetter(word[l], l + 1, hasSmallCaps));
                }

                wordData.push("</span>");

                return wordData;
            },

            breakText = function ($item, hasSmallCaps) {

                var text = $item.text().trim(),
                    words = text.split(/\s/),

                    textData = [],
                    w = 0;

                for (w; w < words.length; w++) {

                    textData = textData.concat(breakWord(words[w], w + 1, hasSmallCaps));

                    if (w < words.length - 1) {

                        textData.push(getWhiteSpace(w + 1));
                    }
                }

                return textData;
            },

            processElement = function (i, el) {

                ns.$temp[0] = el;

                var smallCapsAttr = ns.SmallCaps.getState(ns.$temp),

                    result = breakText(ns.$temp, smallCapsAttr);

                if (smallCapsAttr) {

                    ns.SmallCaps.removeItem(ns.$temp);
                }

                ns.$temp.html(result.join(""));
            },

            execInit = function (selector) {

                var items = document.querySelectorAll(selector),

                    length = items.length,
                    i = 0;

                for (i; i < length; i++) {

                    processElement(i, items[i]);
                }
            },

            init = function () {

                execInit(SELECTOR.items);

                if (window.requestIdleCallback) {

                    window.requestIdleCallback(execInit.bind(this, SELECTOR.lazyItems));

                } else {

                    setTimeout(execInit.bind(this, SELECTOR.lazyItems), 0);
                }
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
