/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns) {

    ns.ConsoleMessage = (function () {

        var STYLES = "font-family: 'Josefin Sans'; font-size: 17px; font-weight: 400; line-height: 27px; color: #7D6937;",

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

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS"))));
