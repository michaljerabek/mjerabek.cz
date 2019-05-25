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

            ID = {
                self: "co-delam"
            },

            SELECTOR = {
                self: ".offer",

                background: ".offer__background",
                backgroundLayers: ".offer__background-layer",
                findSquare: ".square"
            },

            FEATURES_ANIMS_SCRIPT = ns.ENV.match(/^prod/i) ? "build/offer-features-animations.build.min.js" : "js/modules/OfferFeaturesAnimations.js",

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
                    refreshOnResize: false,

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

                ns.$BGObjectsOpacityAnimation.then(function () {

                    setTimeout(function() {

                        ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSquare]);

                    }, 100);
                });
            },

            isIE10Or11 = function () {

                return parseInt($self.css("text-indent")) === 1;
            },

            loadFeaturesAnims = function () {

                var elScript = document.createElement("script");

                elScript.async = true;
                elScript.src = FEATURES_ANIMS_SCRIPT;

                document.body.appendChild(elScript);
            },

            ensureFeaturesAnimsLoad = function () {

                if (window.location.hash === "#" + ID.self) {

                    loadFeaturesAnims();

                } else {

                    if (ns.$win.scrollTop() > 0) {

                        var sectionRect = $self[0].getBoundingClientRect();

                        if (sectionRect.top <= window.innerHeight * 0.667 && sectionRect.bottom >= 0) {

                            return loadFeaturesAnims();
                        }
                    }

                    ns.$win.on("main-nav__target-changed.Offer." + ns, function (event, target) {

                        if (target === ID.self) {

                            loadFeaturesAnims();

                            ns.$win.off("main-nav__target-changed.Offer." + ns);
                        }
                    });
                }
            },

            init = function () {

                $self = $(SELECTOR.self);

                checkScrollTop();

                //ie fix
                setTimeout(checkScrollTop, 50);

                ns.$ParallaxLoader.then(initBackground);

                if (!isIE10Or11()) {

                    ensureFeaturesAnimsLoad();
                }
            };

        return {
            init: init,

            find: function (selector) {

                return $self.find(selector);
            },

            getSelf: function () {

                return $self;
            },

            getId: function () {

                return ID.self;
            }
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
