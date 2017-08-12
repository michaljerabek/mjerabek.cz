/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);

    ns.Intro = (function () {

        var CLASS = {
                hidden: "intro__title--hidden",

                parallaxDestroyed: "intro--no-parallax"
            },

            SELECTOR = {
                self: ".intro",

                title: ".intro__title",

                background: ".intro__background",
                backgroundLayers: ".intro__background-layer",
                findSquare: ".square"
            },

            $self,
            $title,

            $bgLayers,
            parallax,

            initBackground = function () {

                $bgLayers = $self.find(SELECTOR.backgroundLayers);

                parallax = new Parallax({
                    parallax: SELECTOR.background,
                    layers: $bgLayers,
                    fakeTilt: false
                });

                ns.$win.on("verylowperformance." + ns, function () {

                    parallax.destroy();

                    $self.addClass(CLASS.parallaxDestroyed);
                });

                ns.$win.on("technologies-opened." + ns + " technologies-closed." + ns, function (event) {

                    parallax[event.type.match(/opened/) ? "disable" : "enable"]();
                });

                ns.BGObjectsOpacityAnimation.add($bgLayers, SELECTOR.findSquare);
            },

            init = function () {

                $self = $(SELECTOR.self);

                $title = $self.find(SELECTOR.title);

                //text je skrytý kvůli animaci
                $title.removeClass(CLASS.hidden);

                initBackground();
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
