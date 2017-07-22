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

            $title,

            $bgLayers,
            parallax,

            initBackground = function () {

                $bgLayers = $(SELECTOR.backgroundLayers);

                parallax = new Parallax({
                    parallax: SELECTOR.background,
                    layers: $bgLayers,
                    fakeTilt: false
                });

                ns.$win.on("verylowperformance." + ns, function () {
                    parallax.destroy();
                });

                ns.BGObjectsOpacityAnimation.add($bgLayers, SELECTOR.findSquare);
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
