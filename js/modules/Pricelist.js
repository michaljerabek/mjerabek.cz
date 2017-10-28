/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);

    ns.Pricelist = (function () {

        var CLASS = {
                parallaxDestroyed: "pricelist--no-parallax",

                showTermsAndConditions: "pricelist__terms-and-conditions--show"
            },

            SELECTOR = {
                self: ".pricelist",

                termsAndConditions: ".pricelist__terms-and-conditions",
                termsAndConditionsLink: ".pricelist__terms-and-conditions-link",

                background: ".pricelist__background",
                backgroundLayers: ".pricelist__background-layer",
                findSquare: ".square"
            },

            $self,
            $termsAndConditions,

            $bgLayers,
            parallax,

            showTermsAndConditions = function (event) {

                $termsAndConditions.toggleClass(CLASS.showTermsAndConditions);

                event.preventDefault();
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

                ns.$win.on("technologies__opened." + ns + " technologies__closed." + ns, function (event) {

                    parallax[event.type.match(/opened/) ? "disable" : "enable"]();
                });

                setTimeout(function() {

                    ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSquare]);
                }, 150);
            },

            init = function () {

                $self = $(SELECTOR.self);

                $termsAndConditions = $self.find(SELECTOR.termsAndConditions);

                $self.find(SELECTOR.termsAndConditionsLink)
                    .on("click." + ns, showTermsAndConditions);

                setTimeout(initBackground, 150);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
