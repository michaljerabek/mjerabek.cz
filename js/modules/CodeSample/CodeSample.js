/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, document, window*/

(function (ns) {

    ns.CodeSample = (function () {

        var SELECTOR = {
                scrollingElement: ".scrolling-element"
            },

            MOBILE_MQ = "(max-width: 767px)",

            STATE = {
                mobile: "mobile",
                nonmobile: "nonmobile"
            },

            SCROLL_OPTIONS = {
                theme: "minimal",
                axis: "yx",
                scrollInertia: 500,
                mouseWheel:{
                    scrollAmount: 324,
                    deltaFactor: 27
                }
            },

            LOAD = {
                STYLE: [
                    "../libs/malihu-custom-scrollbar-plugin-3.1.5/jquery.mCustomScrollbar.min.css"
                ],
                SCRIPT: [
                    "https://code.jquery.com/jquery-3.4.1.min.js",
                    "../libs/malihu-custom-scrollbar-plugin-3.1.5/jquery.mCustomScrollbar.concat.min.js"
                ]
            },

            hasCustomScrollbars = false,
            customScrollbarLoading = false,
            customScrollbarLoaded = false,
            initScrollbarsAfterLoad = false,

            scrollingElement,
            $scrollingElement,

            loadScrollbarResources = function () {

                if (customScrollbarLoading || customScrollbarLoaded) {

                    return;
                }

                customScrollbarLoading = true;

                var currentLoadCount = 0,
                    totalLoadCount = LOAD.STYLE.length + LOAD.SCRIPT.length,

                    onLoad = function () {

                        currentLoadCount++;

                        if (currentLoadCount === totalLoadCount) {

                            customScrollbarLoading = false;
                            customScrollbarLoaded = true;

                            if (initScrollbarsAfterLoad) {

                                initCustomScrollbars();
                            }
                        }
                    };

                LOAD.STYLE.forEach(function (URL) {

                    var elLink = document.createElement("link");

                    elLink.rel = "stylesheet";
                    elLink.href = URL;
                    elLink.onload = onLoad;

                    document.body.appendChild(elLink);
                });

                LOAD.SCRIPT.forEach(function (URL) {

                    var elScript = document.createElement("script");

                    elScript.defer = true;
                    elScript.async = false;
                    elScript.src = URL;
                    elScript.onload = onLoad;

                    document.body.appendChild(elScript);
                });
            },

            initCustomScrollbars = function () {

                initScrollbarsAfterLoad = true;

                if (hasCustomScrollbars || customScrollbarLoading) {

                    return;
                }

                if (!customScrollbarLoaded) {

                    return loadScrollbarResources();
                }

                $scrollingElement = jQuery(scrollingElement);

                $scrollingElement.mCustomScrollbar(SCROLL_OPTIONS);

                hasCustomScrollbars = true;
            },

            setParentMQState = function () {

                var state = window.parent.matchMedia(MOBILE_MQ).matches ? STATE.mobile : STATE.nonmobile;

                document.documentElement.className = state;
            },

            resetScrollPosition = function () {

                if ($scrollingElement && $scrollingElement.length && scrollingElement.mCustomScrollbar) {

                    $scrollingElement.mCustomScrollbar("scrollTo", [0, 0], {
                        scrollInertia: 0
                    });

                } else {

                    if (scrollingElement.scrollTo) {

                        scrollingElement.scrollTo(0, 0);
                    }
                }
            },

            init = function () {

                scrollingElement = document.querySelector(SELECTOR.scrollingElement);

                window.parent.addEventListener("resize", setParentMQState);

                setParentMQState();

                if (window.parent[ns].CustomScrollbarLoader.shouldBeLoaded()) {

                    initScrollbarsAfterLoad = window[ns + "_CodeSample__initCustomScrollbars"];

                    loadScrollbarResources();
                }

                return init;
            };

        return {
            init: init(),

            initCustomScrollbars: initCustomScrollbars,
            resetScrollPosition: resetScrollPosition
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS"))));
