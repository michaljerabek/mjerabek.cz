/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns, $) {

    ns.$ConsoleMessage = ns.$ConsoleMessage || $.Deferred();

    ns.ConsoleMessage = (function () {

        var STYLES = "font-family: 'josefin-sans'; font-size: 17px; font-weight: 400; line-height: 27px; color: #7B6839;",

            MSG_IDENTIFIER = /^-/,

            init = function () {

                Array.prototype.slice.call(document.head.childNodes).forEach(function (node) {

                    if (node.nodeType === 8 && node.textContent.match(MSG_IDENTIFIER)) {

                        var message = node.textContent.replace(MSG_IDENTIFIER, "").replace(/\s+/g, " ").trim();

                        if (navigator.userAgent.match(/firefox|chrome/i)) {

                            console.log("%c" + message, STYLES);

                            return false;
                        }

                        console.log(message);

                        return false;
                    }
                });
            };

        return {
            init: init
        };

    }());

    setTimeout(ns.$ConsoleMessage.resolve, 2000);

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS", jQuery))));
