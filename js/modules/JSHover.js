/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$doc = ns.$doc || $(document);
    ns.$temp = ns.$temp || $([null]);

    ns.JSHover = (function () {

        var CLASS = {
                isHover: "hover"
            },

            SELECTOR = {
                item: "[data-js-hover='true']"
            },

            DATA = {
                preventClick: "js-hover-prevent-click"
            },

            SUPPORTS_PASSIVE = (function() {

                try {

                    window.addEventListener("test", null, { passive: true });

                    return true;

                } catch (e) {}

                return false;
            }()),

            hoverEl,

            byTouch = false,

            onItem = false,

            init = function () {

                var preventClick = null;

                window.document.addEventListener("touchstart", function (event) {

                    ns.$temp[0] = event.target;

                    var $jsHover = ns.$temp.closest(SELECTOR.item),

                        jsHoverEl;

                    if ($jsHover.length) {

                        jsHoverEl = $jsHover[0];

                        byTouch = true;

                        onItem = true;

                        preventClick = null;

                        if (hoverEl !== jsHoverEl) {

                            ns.$temp[0] = jsHoverEl;

                            if (ns.$temp.data(DATA.preventClick)) {

                                preventClick = jsHoverEl;
                            }

                            ns.$temp.addClass(CLASS.isHover);

                            ns.$temp[0] = hoverEl;

                            ns.$temp.removeClass(CLASS.isHover);

                            hoverEl = jsHoverEl;
                        }
                    }

                }, SUPPORTS_PASSIVE ? { passive: true } : false);

                ns.$doc.on("click." + ns, SELECTOR.item, function (event) {

                    if (preventClick === event.currentTarget) {

                        event.preventDefault();
                    }

                    preventClick = null;
                });

                window.document.addEventListener("touchstart", function () {

                    if (!onItem) {

                        if (hoverEl) {

                            ns.$temp[0] = hoverEl;

                            ns.$temp.removeClass(CLASS.isHover);

                            hoverEl = null;
                        }

                        preventClick = null;
                    }

                    onItem = false;

                }, SUPPORTS_PASSIVE ? { passive: true } : false);

                ns.$doc.on("mouseenter." + ns + " mouseleave." + ns, SELECTOR.item, function (event) {

                    if (byTouch) {

                        byTouch = false;

                        return;
                    }

                    var mouseenter = event.type.match(/enter/);

                    ns.$temp[0] = event.currentTarget;

                    ns.$temp[mouseenter ? "addClass" : "removeClass"](CLASS.isHover);

                    hoverEl = mouseenter ? event.currentTarget: null;
                });
            };

        return {
           init: init
        };

    }());
}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
