/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.TechnologiesLoader = (function () {

        var CLASS = {
                loading: "technologies--loading",
                showLoader: "technologies--show-loader",
                loaded: "technologies--loaded",
                error: "technologies--error",

                btnProgress: "btn--progress",
                btnError: "btn--error",

                js: "technologies-loader__js",
                css: "technologies-loader__css",
                font: "technologies-loader__font"
            },

            DATA = {
                tab: "technologies-tab"
            },

            SELECTOR = {
                technologiesLoader: ".technologies-loader",
                technologies: ".technologies",

                openers: "[data-" + DATA.tab + "]",
                btn: ".btn"
            },

            STATE = {
                ERROR: -1,
                INIT: 1,
                LOADING: 10,
                LOADED: 20
            },

            TECHNOLOGIES_HASH_REGEX = /^#(html|css|js)$/i,
            SECTION_TARGETS_REGEX = /^co-delam$/i,

            SECTION_TARGETS_LOAD_DELAY = 3000,

            JS_TO_LOAD = ns.ENV.match(/^prod/i) ? "build/technologies.build.min.js" : "build/technologies.build.js",
            CSS_TO_LOAD = ns.ENV.match(/^prod/i) ? "build/technologies.build.min.css" : "build/technologies.build.css",
            FONT_TO_LOAD = "https://fonts.googleapis.com/css?family=PT+Mono&display=swap",

            currentState = STATE.INIT,

            loadIdleCallback,

            $technologiesLoader,
            $technologies,
            $openers,

            elOpener,
            initTab,

            sectionTargetsLoadDebounce,

            shouldBeLoadedByHash = function () {

                return currentState <= STATE.INIT && window.location.hash && window.location.hash.match(TECHNOLOGIES_HASH_REGEX);
            },

            onError = function (event) {

                currentState = STATE.ERROR;

                event.target.parentElement.removeChild(event.target);

                $technologies.addClass(CLASS.error)
                    .removeClass(CLASS.showLoader);

                if (!elOpener) {

                    return;
                }

                ns.$temp[0] = elOpener;

                if (ns.$temp.is(SELECTOR.btn)) {

                    ns.$temp.removeClass(CLASS.btnProgress)
                        .addClass(CLASS.btnError);
                }

                elOpener = null;
            },

            onLoad = function (event) {

                switch (event.target.className) {

                    case CLASS.css:

                        CSS_TO_LOAD = null;

                        break;

                    case CLASS.js:

                        JS_TO_LOAD = null;

                        break;
                }

                if (!CSS_TO_LOAD && !JS_TO_LOAD) {

                    currentState = STATE.LOADED;

                    if ($openers) {

                        $openers.removeClass(CLASS.btnProgress)
                            .removeClass(CLASS.btnError)
                            .off(".TechnologiesLoader." + ns);
                    }

                    ns.$win.off(".TechnologiesLoader." + ns)
                        .off("main-nav__target-changed.TechnologiesLoader." + ns);

                    $technologiesLoader.off("." + ns);

                    $technologies.removeClass(CLASS.loading)
                        .removeClass(CLASS.showLoader)
                        .addClass(CLASS.loaded);

                    if (elOpener) {

                        ns.$temp[0] = elOpener;

                        initTab = ns.$temp.data(DATA.tab);
                    }

                    ns.Technologies.init(initTab);

                    if (elOpener) {

                        elOpener.click();
                    }
                }
            },

            load = function () {

                if (loadIdleCallback && window.cancelIdleCallback) {

                    window.cancelIdleCallback(loadIdleCallback);
                }

                if (currentState > STATE.INIT || (!JS_TO_LOAD && !CSS_TO_LOAD)) {

                    return;
                }

                currentState = STATE.LOADING;

                $technologies.removeClass(CLASS.error)
                    .addClass(CLASS.loading);

                var elScript = JS_TO_LOAD ? document.createElement("script") : null,
                    elStyleLink = CSS_TO_LOAD ? document.createElement("link") : null,
                    elFontLink = FONT_TO_LOAD ? document.createElement("link") : null;

                if (elScript) {

                    elScript.className = CLASS.js;
                    elScript.defer = true;
                    elScript.src = JS_TO_LOAD;
                    elScript.onload = onLoad;
                    elScript.onerror = onError;

                    document.head.appendChild(elScript);
                }

                if (elStyleLink) {

                    elStyleLink.className = CLASS.css;
                    elStyleLink.rel = "stylesheet";
                    elStyleLink.media = "screen";
                    elStyleLink.href = CSS_TO_LOAD;
                    elStyleLink.onload = onLoad;
                    elStyleLink.onerror = onError;

                    document.head.appendChild(elStyleLink);
                }

                if (elFontLink) {

                    elFontLink.className = CLASS.font;
                    elFontLink.rel = "stylesheet";
                    elFontLink.href = FONT_TO_LOAD;

                    document.head.appendChild(elFontLink);

                    FONT_TO_LOAD = null;
                }
            },

            cancelLoader = function () {

                if (!elOpener) {

                    var currentScrollTop = ns.$win.scrollTop();

                    window.location.hash = "";

                    ns.$win.scrollTop(currentScrollTop);
                }

                elOpener = null;

                $technologies.removeClass(CLASS.showLoader);
            },

            initLoadEvents = function () {

                ns.$win.on("hashchange.TechnologiesLoader." + ns, function () {

                    if (shouldBeLoadedByHash()) {

                        load();
                    }
                });

                ns.$win.on("main-nav__target-changed.TechnologiesLoader." + ns, function (event, target) {

                    clearTimeout(sectionTargetsLoadDebounce);

                    if (target.match(SECTION_TARGETS_REGEX) && currentState <= STATE.INIT) {

                        sectionTargetsLoadDebounce = setTimeout(function() {

                            if (currentState <= STATE.INIT) {

                                if (window.requestIdleCallback) {

                                    loadIdleCallback = window.requestIdleCallback(load);

                                } else {

                                    load();
                                }
                            }
                        }, SECTION_TARGETS_LOAD_DELAY);
                    }
                });

                $openers.on(["mouseenter", "touchstart", "keydown", "click"].join(".TechnologiesLoader." + ns + " ") + ".TechnologiesLoader." + ns, function (event) {

                    ns.$temp[0] = event.currentTarget;

                    if (event.type === "click") {

                        event.preventDefault();

                        if (currentState < STATE.LOADED) {

                            if (ns.$temp.is(SELECTOR.btn)) {

                                if (elOpener === event.currentTarget) {

                                    elOpener = null;

                                    ns.$temp.removeClass(CLASS.btnError)
                                        .removeClass(CLASS.btnProgress);

                                    return;
                                }

                                ns.$temp.removeClass(CLASS.btnError)
                                    .addClass(CLASS.btnProgress);

                            } else {

                                $technologies.addClass(CLASS.showLoader);
                            }

                            elOpener = event.currentTarget;
                        }

                        if (currentState <= STATE.INIT) {

                            initTab = ns.$temp.data(DATA.tab);

                            load();
                        }
                    } else {

                        if (currentState <= STATE.INIT) {

                            initTab = ns.$temp.data(DATA.tab);

                            if (window.requestIdleCallback) {

                                loadIdleCallback = window.requestIdleCallback(load);

                            } else {

                                load();
                            }
                        }
                    }
                });
            },

            initEvents = function () {

                $technologiesLoader.on("click." + ns + " touchend." + ns, cancelLoader);

                ns.$win.on("keyup.TechnologiesLoader" + ns, function (event) {

                    if (event.which === 27) { //ESC

                        cancelLoader();
                    }
                });
            },

            init = function () {

                $technologies = $(SELECTOR.technologies);
                $technologiesLoader = $(SELECTOR.technologiesLoader);

                if (shouldBeLoadedByHash()) {

                    load();

                } else {

                    $openers = $(SELECTOR.openers);

                    initLoadEvents();
                }

                initEvents();
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
