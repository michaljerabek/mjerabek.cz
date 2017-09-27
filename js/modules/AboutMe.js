/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax, ParallaxController*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.AboutMe = (function () {

        var SELECTOR = {
                self: ".about-me",

                photo: ".about-me__photo",
                photoImg: ".about-me__img"
            },

            PHOTO_FILTER = 20,

            parallax,
            useFilter = true,
            $img = null,

            applyPhotoFilter = function ($el, progress) {

                if (!useFilter) {

                    return;
                }

                $img = $img || $el.find(SELECTOR.photoImg);

                var recalc = progress > 0 ? Math.max(-1 + (progress * 2), 0) : Math.min(1 + (progress * 2), 0);

                recalc = Math.abs(recalc);

                var filter = (recalc * PHOTO_FILTER).toFixed(3);

                $img.css("filter", "blur(" + filter + "px)");
            },

            checkPhotoPosition = function () {

                var selfRect = parallax.$parallax[0].getBoundingClientRect(),
                    photoRect = parallax.$layers[0].getBoundingClientRect();

                if (photoRect.bottom < selfRect.bottom) {

                    ParallaxController.refresh(true);

                    setTimeout(checkPhotoPosition, 1000);
                }
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

                        parallax.$layers.find(SELECTOR.photoImg)
                            .css("filter", "none");
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
