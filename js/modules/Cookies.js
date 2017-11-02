/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, cookieconsent*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.Cookies = (function () {

        var CLASS = {
                fadeOut: "cookies--fade-out"
            },

            TEMPLATE = [
                "<div class=\"cookies x-print cc-window\" role=\"dialog\" aria-label=\"cookieconsent\" aria-describedby=\"cookieconsent:desc\">",
                    "<div class=\"layout__center\">",
                        "<span class=\"cookies__message cc-message\" id=\"cookieconsent:desc\">Tento web používá k analýze návštěvnosti soubory cookies. <a class=\"cookies__link cc-link\" tabindex=\"0\" href=\"http://cookiesandyou.com\" target=\"_blank\" lang=\"en\" aria-label=\"Dozvědět se více o cookies\">Více informací zde <i>(en)</i></a>.</span>",
                        "<div class=\"cookies__compliance cc-compliance\">",
                            "<a class=\"cookies__dismiss btn btn--dark btn--small cc-dismiss cc-btn\" aria-label=\"Zavřít zprávu o cookies\" tabindex=\"0\"><span class=\"text cc-btn cc-dismiss\"><span class=\"small cc-btn cc-dismiss\">OK</span></span></a>",
                        "</div>",
                    "</div>",
                "</div>"
            ].join(""),

            onPopupOpen = function () {

                if (ns.$win.scrollTop()) {

                    this.element.style.transitionDelay = "0s";
                }
            },

            onPopupClose = function () {

                if (typeof this.element.style.transition !== "undefined") {

                    this.element.style.transitionDelay = "";

                    this.element.className += (" " + CLASS.fadeOut);

                    this.element.addEventListener("transitionend", function onCookeisCloseTransitionend(event) {

                        if (event.target === this.element) {

                            this.element.className = this.element.className.replace(" " + CLASS.fadeOut, "");

                            this.element.removeEventListener("transitionend", onCookeisCloseTransitionend);
                        }
                    }.bind(this));
                }
            },

            init = function () {

                cookieconsent.initialise({
                    autoOpen: true,
                    overrideHTML: TEMPLATE,
                    onPopupOpen: onPopupOpen,
                    onPopupClose: onPopupClose
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));