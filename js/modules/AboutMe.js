/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.AboutMe = (function () {

        var SELECTOR = {
                self: ".about-me",

                photo: ".about-me__photo"
            },

            PHOTO_FILTER = 20,

            parallax,
            useFilter = true,

            applyPhotoFilter = function ($el, progress) {

                if (!useFilter) {

                    return;
                }

                var recalc = progress > 0 ? Math.max(-1 + (progress * 2), 0) : Math.min(1 + (progress * 2), 0);

                recalc = Math.abs(recalc);

                var filter = (recalc * PHOTO_FILTER).toFixed(3);

                $el.css("filter", "blur(" + filter + "px)");
            },

            init = function (debug) {

                setTimeout(function() {

                    parallax = new Parallax({
                        parallax: SELECTOR.self,
                        layers: SELECTOR.photo,
                        fakeTilt: false,

                        onTransform: applyPhotoFilter
                    });

                    ns.$win.on("lowperformance." + ns, function () {

                        useFilter = false;

                        parallax.$layers.css("filter", "none");
                    });

                    if (debug) {

                        ns.$win.on("resize", function () {

                            ns.$win.scrollTop($(SELECTOR.self).offset().top);
                        });
                    }
                }, 100);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
