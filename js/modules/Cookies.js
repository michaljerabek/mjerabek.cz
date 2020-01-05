/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, cookieconsent*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.$Cookies = ns.$Cookies || $.Deferred();

    ns.Cookies = (function () {

        var CLASS = {
                fadeOut: "cookies--fade-out"
            },

            TEMPLATE = [
                "<div class=\"cookies x-print cc-window\" role=\"dialog\" aria-label=\"cookieconsent\" aria-describedby=\"cookieconsent:desc\">",
                    "<div class=\"layout__center\">",
                        "<span class=\"cookies__message cc-message\" id=\"cookieconsent:desc\">Tento web používá k&nbsp;analýze návštěvnosti soubory cookies (Google Analytics). <a class=\"cookies__link cc-link\" tabindex=\"0\" href=\"http://cookiesandyou.com\" target=\"_blank\" rel=\"noreferrer\" hreflang=\"en\">Více o&nbsp;cookies zde&nbsp;<i>(en)</i></a>. <span class=\"cookies__detail\">Web odesílá data o&nbsp;použití interaktivních prvků, pozastavení se v&nbsp;sekci nebo odeslání formuláře. Data jsou anonymní (v&nbsp;případě kontaktování však mohu být schopný určit, že se jednalo o&nbsp;vás) a&nbsp;slouží pro zlepšení fungování tohoto webu. Toto chování nelze vypnout při zachování plné funkčnosti.</span></span>",
                        "<div class=\"cookies__compliance cc-compliance\">",
                            "<a class=\"cookies__dismiss btn btn--dark btn--special-small cc-dismiss cc-btn\" tabindex=\"0\"><span class=\"text cc-btn cc-dismiss\"><span class=\"small cc-btn cc-dismiss\">OK</span></span></a>",
                        "</div>",
                    "</div>",
                "</div>"
            ].join(""),

            PLUGIN_LINK = "https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js",

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

            loadCookieconsent = function () {

                return $.getScript(PLUGIN_LINK);
            },

            initCookieconsent = function () {

                cookieconsent.initialise({
                    autoOpen: true,
                    overrideHTML: TEMPLATE,
                    onPopupOpen: onPopupOpen,
                    onPopupClose: onPopupClose,
                    cookie: {
                        expiryDays: window.location.host.match(/127\.0\.0\.1/) ? 0.000695 : 365
                    }
                });
            },

            init = function () {

                loadCookieconsent().then(initCookieconsent);
            };

        return {
            init: init
        };

    }());

    if (window.requestIdleCallback) {

        window.requestIdleCallback(ns.$Cookies.resolve);

    } else {

        setTimeout(ns.$Cookies.resolve, 0);
    }

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
