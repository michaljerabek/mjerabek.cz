/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.Offer = (function () {

        var CLASS = {
                initFadeIn: "offer--init-fade-in"
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

                $bgLayers = $(SELECTOR.backgroundLayers);

                parallax = new Parallax({
                    parallax: SELECTOR.background,
                    layers: $bgLayers,
                    fakeTilt: false
                });

                setTimeout(function() {
                    parallax.refresh();
                }, 200);

                ns.$win.on("verylowperformance." + ns, function () {
                    parallax.destroy();
                });

                ns.BGObjectsOpacityAnimation.add($bgLayers, SELECTOR.findSquare);
            },

            init = function () {

                initBackground();

                $self = $(SELECTOR.self);

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
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
