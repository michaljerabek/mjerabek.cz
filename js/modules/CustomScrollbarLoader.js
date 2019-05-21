/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.CustomScrollbarLoader = (function () {

        var EVENT = {
                loaded: "custom-scrollbar__loaded." + ns
            },

            JS_TO_LOAD = "libs/malihu-custom-scrollbar-plugin-3.1.5/jquery.mCustomScrollbar.concat.min.js",
            CSS_TO_LOAD = "libs/malihu-custom-scrollbar-plugin-3.1.5/jquery.mCustomScrollbar.css",

            TECHNOLOGIES_HASH_REGEX = /^#(html|css|js)$/i,

            onLoad = function (event) {

                if (event.target.tagName.toLowerCase() === "link") {

                    CSS_TO_LOAD = null;
                }

                if (event.target.tagName.toLowerCase() === "script") {

                    JS_TO_LOAD = null;
                }

                if (!CSS_TO_LOAD && !JS_TO_LOAD) {

                    ns.$win.trigger(EVENT.loaded);
                }
            },

            load = function () {

                var elScript = document.createElement("script"),
                    elLink = document.createElement("link");

                elScript.defer = true;
                elScript.src = JS_TO_LOAD;
                elScript.onload = onLoad;

                elLink.rel = "stylesheet";
                elLink.href = CSS_TO_LOAD;
                elLink.onload = onLoad;

                document.head.appendChild(elScript);
                document.head.appendChild(elLink);
            },

            shouldBeLoaded = function () {

                var style = document.body.style;

                return typeof style.webkitOverflowScrolling === "undefined" && typeof style.scrollbarWidth === "undefined" &&
                    !document.documentElement.className.match(/android/);
            },

            technologiesShouldBeOpened = function () {

                return window.location.hash && window.location.hash.match(TECHNOLOGIES_HASH_REGEX);
            },

            init = function () {

                if (shouldBeLoaded()) {

                    if (technologiesShouldBeOpened()) {

                        load();

                    } else if (window.requestIdleCallback) {

                        window.requestIdleCallback(load);

                    } else {

                        setTimeout(load, 0);
                    }
                }
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
