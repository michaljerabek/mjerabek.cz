/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Infinitum, CodeMirror*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$doc = ns.$doc || $(document);
    ns.$temp = ns.$temp || $([null]);

    ns.TechnologiesLoader = (function () {

        var CLASS = {
                loaded: "technologies--loaded"
            },

            DATA = {
                tab: "technologies-tab"
            },

            SELECTOR = {
                technologies: ".technologies",

                openers: "[data-" + DATA.tab + "]"
            },

            TECHNOLOGIES_HASH_REGEX = /^#(html|css|js)$/,

            JS = ns.ENV.match(/^prod/i) ? "build/Technologies.build.min.js" : "js/modules/Technologies.js",
            CSS = ns.ENV.match(/^prod/i) ? "build/technologies.build.min.css" : "css/components/technologies.css",

            loaded = false,

            $technologies,
            $openers,

            shouldBeLoaded = function () {

                return !loaded && window.location.hash && window.location.hash.match(TECHNOLOGIES_HASH_REGEX);
            },

            load = function (initTab, elOpener) {

                var elScript = document.createElement("script"),
                    elLink = document.createElement("link"),

                    loadCount = 0,

                    onLoad = function () {

                        loadCount++;

                        if (loadCount === 2) {

                            $technologies.addClass(CLASS.loaded);

                            ns.Technologies.init(initTab);

                            if (elOpener) {

                                elOpener.click();
                            }

                            $openers.off(".TechnologiesLoader." + ns);
                        }
                    };

                elScript.src = JS;
                elScript.onload = onLoad;

                elLink.rel = "stylesheet";
                elLink.media = "screen";
                elLink.href = CSS;
                elLink.onload = onLoad;

                document.head.appendChild(elLink);
                document.head.appendChild(elScript);

                loaded = true;
            },

            init = function () {

                $technologies = $(SELECTOR.technologies);

                if (shouldBeLoaded()) {

                    load();

                } else {

                    ns.$win.on("hashchange." + ns, function () {

                        if (shouldBeLoaded()) {

                            load();
                        }
                    });

                    $openers = $(SELECTOR.openers);

                    $openers.on(["mouseenter", "touchstart", "keydown", "click"].join(".TechnologiesLoader." + ns + " ") + ".TechnologiesLoader." + ns, function (event) {

                        if (event.type === "click") {

                            event.preventDefault();
                        }

                        if (!loaded) {

                            ns.$temp[0] = event.currentTarget;

                            load(ns.$temp.data(DATA.tab), event.type === "click" ? event.currentTarget: null);
                        }
                    });
                }
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
