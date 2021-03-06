/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.Intro = (function () {

        var CLASS = {
                parallaxDestroyed: "intro--no-parallax"
            },

            SELECTOR = {
                self: ".intro",

                background: ".intro__background",
                backgroundLayers: ".intro__background-layer",
                findSquare: ".square",

                logoTemplate: ".intro__logo-template"
            },

            $self,

            $bgLayers,
            parallax,

            loadLogo = function () {

                var $template = $self.find(SELECTOR.logoTemplate);

                $template.replaceWith($template.text());
            },

            initBackground = function () {

                $bgLayers = $self.find(SELECTOR.backgroundLayers);

                parallax = new Parallax({
                    parallax: SELECTOR.background,
                    layers: $bgLayers,
                    fakeTilt: false,
                    refreshOnResize: false
                });

                ns.$win.on("verylowperformance." + ns, function () {

                    parallax.destroy();

                    $self.addClass(CLASS.parallaxDestroyed);
                });

                ns.$win.on("technologies__opened." + ns + " technologies__closed." + ns, function (event) {

                    parallax[event.type.match(/opened/) ? "disable" : "enable"]();
                });

                ns.$BGObjectsOpacityAnimation.then(function () {

                    setTimeout(function() {

                        ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSquare]);

                    }, 100);
                });
            },

            init = function () {

                $self = $(SELECTOR.self);

                ns.$ParallaxLoader.then(initBackground);

                setTimeout(loadLogo, 3000);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
