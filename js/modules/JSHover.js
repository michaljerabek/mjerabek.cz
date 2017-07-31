/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

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
                item: "[data-js-hover='true']",

                isHover: "." + CLASS.isHover
            },

            DATA = {
                preventClick: "js-hover-prevent-click"
            },

            byTouch = false,

            onItem = false,

            init = function () {

                ns.$doc.on("touchstart." + ns, SELECTOR.item, function (e) {

                    byTouch = true;

                    onItem = true;

                    ns.$temp[0] = e.currentTarget;

                    if (!ns.$temp.hasClass(CLASS.isHover) && ns.$temp.data(DATA.preventClick)) {

                        e.preventDefault();
                    }

                    $(SELECTOR.isHover).removeClass(CLASS.isHover);

                    ns.$temp.addClass(CLASS.isHover);
                });

                ns.$doc.on("touchstart." + ns, function () {

                    if (!onItem) {

                        $(SELECTOR.isHover).removeClass(CLASS.isHover);
                    }

                    onItem = false;
                });

                ns.$doc.on("mouseenter." + ns + " mouseleave." + ns, SELECTOR.item, function (e) {

                    if (byTouch) {

                        byTouch = false;

                        return;
                    }

                    ns.$temp[0] = e.currentTarget;

                    ns.$temp[e.type.match(/enter/) ? "addClass" : "removeClass"](CLASS.isHover);
                });
            };

        return {
           init: init
        };

    }());
}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
