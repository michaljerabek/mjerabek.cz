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

            hoverEl,

            byTouch = false,

            onItem = false,

            init = function () {

                var preventClick = null;

                ns.$doc.on("touchstart." + ns, SELECTOR.item, function (event) {

                    byTouch = true;

                    onItem = true;

                    preventClick = null;

                    if (hoverEl !== event.currentTarget) {

                        ns.$temp[0] = event.currentTarget;

                        if (ns.$temp.data(DATA.preventClick)) {

                            preventClick = event.currentTarget;
                        }

                        ns.$temp.addClass(CLASS.isHover);

                        ns.$temp[0] = hoverEl;

                        ns.$temp.removeClass(CLASS.isHover);

                        hoverEl = event.currentTarget;
                    }
                });

                ns.$doc.on("click." + ns, SELECTOR.item, function (event) {

                    if (preventClick === event.currentTarget) {

                        event.preventDefault();
                    }

                    preventClick = null;
                });

                ns.$doc.on("touchstart." + ns, function () {

                    if (!onItem) {

                        if (hoverEl) {

                            ns.$temp[0] = hoverEl;

                            ns.$temp.removeClass(CLASS.isHover);

                            hoverEl = null;
                        }

                        preventClick = null;
                    }

                    onItem = false;
                });

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
