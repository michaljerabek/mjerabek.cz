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
                    fakeTilt: false
                });

                ns.$win.on("verylowperformance." + ns, function () {

                    parallax.destroy();

                    $self.addClass(CLASS.parallaxDestroyed);
                });

                ns.BGObjectsOpacityAnimation.add($bgLayers, SELECTOR.findSquare);
            },

            init = function () {

                $self = $(SELECTOR.self);

                initBackground();

                checkScrollTop();

                //ie fix
                setTimeout(checkScrollTop, 50);

                var $perspective = $(".ui__perspective");

                ns.$win.on("scroll." + ns, function () {

                    var windowCenter = ns.$win.scrollTop() + (window.innerHeight / 2);

                    $perspective.css("perspective-origin", "50% " + windowCenter + "px");
                });
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
