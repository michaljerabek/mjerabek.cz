/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);

    ns.Intro = (function () {

        var CLASS = {
                hidden: "intro__title--hidden"
            },

            SELECTOR = {
                title: ".intro__title",

                background: ".intro__background",
                backgroundLayers: ".intro__background-layer",
                findSquare: ".square"
            },

            SUPPORTS_CSS_ANIMATIONS = typeof document.body.style.animation !== "undefined",

            SQUARE_ANIM_NAME = "intro__square--fade-in",
            SQUARE_OPACITY_DURATION = 1500,
            SQUARE_MAX_OPACITY = 1,
            SQUARE_MIN_OPACITY = 0.35,
            SQUARE_MIN_CHANGE = 0.25,

            $title,

            $bgLayers,
            parallax,

            animateSquare = function (elSquare) {

                var currentOpacity = parseFloat(elSquare.style.opacity),

                    newRandomOpacity = (Math.random() * (SQUARE_MAX_OPACITY - SQUARE_MIN_OPACITY)) + SQUARE_MIN_OPACITY;

                if (Math.abs(currentOpacity - newRandomOpacity) < SQUARE_MIN_CHANGE) {

                    animateSquare(elSquare);

                    return;
                }

                elSquare.style.opacity = newRandomOpacity;

                setTimeout(animateSquare.bind(null, elSquare), SQUARE_OPACITY_DURATION);
            },

            initBackground = function () {

                $bgLayers = $(SELECTOR.backgroundLayers);

                parallax = new Parallax({
                    parallax: SELECTOR.background,
                    layers: $bgLayers,
                    fakeTilt: false
                });

                if (!SUPPORTS_CSS_ANIMATIONS) {

                    $bgLayers.each(function (i) {

                        ns.$temp[0] = this;

                        setTimeout(
                            animateSquare.bind(null, ns.$temp.find(SELECTOR.findSquare)[0]),
                            SQUARE_OPACITY_DURATION * (i / ($bgLayers.length - 1))
                        );
                    });

                    return;
                }

                $bgLayers.on("animationend." + ns, function (event) {

                    if (event.originalEvent.animationName === SQUARE_ANIM_NAME) {

                        animateSquare(event.originalEvent.target);

                        ns.$temp[0] = this;

                        ns.$temp.off("animationend." + ns);
                    }
                });
            },

            init = function () {

                $title = $(SELECTOR.title);

                //text je skrytý kvůli animaci
                $title.removeClass(CLASS.hidden);

                initBackground();
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
