/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.Offer = (function () {

        var CLASS = {
                initFadeIn: "offer--init-fade-in",
                parallaxDestroyed: "offer--no-parallax"
            },

            SELECTOR = {
                self: ".offer",

                background: ".offer__background",
                backgroundLayers: ".offer__background-layer",
                findSquare: ".square"
            },

            $self,

            $bgLayers,
            parallax,

            checkScrollTop = function  () {

                if (window.innerWidth >= window.innerHeight || ns.$win.scrollTop()) {

                    $self.removeClass(CLASS.initFadeIn);
                }
            },

            initBackground = function () {

                $bgLayers = $self.find(SELECTOR.backgroundLayers);

                parallax = new Parallax({
                    parallax: SELECTOR.background,
                    layers: $bgLayers,
                    fakeTilt: false,

                    onBeforeTransform: function ($el, progress, tX, tY, transform) {

                        var layer = this.layers[0].$el === $el ? this.layers[0] : this.layers[1],

                            extention = layer.parallaxYExtention;

                        transform.x += -extention * progress;
                    }
                });

                ns.$win.on("verylowperformance." + ns, function () {

                    parallax.destroy();

                    $self.addClass(CLASS.parallaxDestroyed);
                });

                ns.$win.on("technologies__opened." + ns + " technologies__closed." + ns, function (event) {

                    parallax[event.type.match(/opened/) ? "disable" : "enable"]();
                });

                setTimeout(function() {

                    ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSquare]);
                }, 100);
            },

            initPerspecitve = function () {

                var $perspective = $(".ui__perspective"),

                    perspectiveDebounce = null;

                ns.$win.on("scroll." + ns + " scroll.Offer." + ns, function () {

                    clearTimeout(perspectiveDebounce);

                    perspectiveDebounce = setTimeout(function() {

                        var windowCenter = ns.$win.scrollTop() + (window.innerHeight / 2);

                        $perspective.css("perspective-origin", "50% " + windowCenter + "px");

                    }, 100);
                });

                ns.$win.trigger("scroll.Offer." + ns);
            },

            init = function () {

                $self = $(SELECTOR.self);

                checkScrollTop();

                //ie fix
                setTimeout(checkScrollTop, 50);

                setTimeout(initBackground, 0);

                setTimeout(initPerspecitve, 0);
            };

        return {
            init: init,

            find: function (selector) {

                return $self.find(selector);
            },

            getSelf: function () {

                return $self;
            }
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
