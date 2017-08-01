/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.AboutMe = (function () {

        var SELECTOR = {
                self: ".about-me",

                photo: ".about-me__photo"
            },

            parallax,

            init = function (debug) {

                parallax = new Parallax({
                    parallax: SELECTOR.self,
                    layers: SELECTOR.photo,
                    fakeTilt: false
                });

                if (debug) {

                    ns.$win.on("resize", function () {

                        ns.$win.scrollTop($(SELECTOR.self).offset().top);
                    });
                }
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
