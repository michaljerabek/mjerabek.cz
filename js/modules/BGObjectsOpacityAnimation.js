/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.$BGObjectsOpacityAnimation = ns.$BGObjectsOpacityAnimation || $.Deferred();

    ns.BGObjectsOpacityAnimation = (function () {

        var CLASS = {
                stopAnimation: "section__background-layer--stop-animation",
                stopHover: "section__background-layer--stop-hover"
            },

            DATA = {
                objectSelector: "object-selector." + ns
            },

            EVENT = {
                add: "bg-object-opacity-animation__add." + ns
            },

            SUPPORTS_CSS_ANIMATIONS = typeof document.body.style.animation !== "undefined",

            ANIM_POSTFIX = "--fade-in",

            OPACITY_DURATION = 1500,
            MAX_OPACITY = 1,
            MIN_OPACITY = 0.25,
            MIN_CHANGE = 0.25,

            events = false,

            $layers = [],

            stopAnimation = false,

            lowPerf = false,

            animate = function (elSquare) {

                if (stopAnimation) {

                    elSquare.style.opacity = "";

                    return;
                }

                var currentOpacity = parseFloat(elSquare.style.opacity),

                    newRandomOpacity = (Math.random() * (MAX_OPACITY - MIN_OPACITY)) + MIN_OPACITY;

                if (Math.abs(currentOpacity - newRandomOpacity) < MIN_CHANGE) {

                    animate(elSquare);

                    return;
                }

                elSquare.style.opacity = newRandomOpacity;

                setTimeout(animate.bind(null, elSquare), OPACITY_DURATION);
            },

            manualInitAnimations = function ($bgLayers, objectSelector) {

                $bgLayers.each(function (i) {

                    ns.$temp[0] = this;

                    objectSelector = objectSelector || ns.$temp.data(DATA.objectSelector);

                    setTimeout(
                        animate.bind(null, ns.$temp.find(objectSelector)[0]),
                        OPACITY_DURATION * (i / ($bgLayers.length - 1))
                    );
                });
            },

            initPerformanceEvents = function () {

                ns.$win.on("lowperformance." + ns, function () {

                    lowPerf = true;

                    stopAnimation = true;

                    $layers.forEach(function ($bgLayers) {
                        $bgLayers.addClass(CLASS.stopAnimation);
                    });
                });

                ns.$win.on("verylowperformance." + ns, function () {

                    $layers.forEach(function ($bgLayers) {
                        $bgLayers.addClass(CLASS.stopHover);
                    });
                });

                ns.$win.on("technologies__opened." + ns + " technologies__closed." + ns, function (event) {

                    if (!lowPerf) {

                        stopAnimation = !!event.type.match(/opened/);

                        $layers.forEach(function ($bgLayers) {

                            $bgLayers[stopAnimation ? "addClass" : "removeClass"](CLASS.stopAnimation);

                            manualInitAnimations($bgLayers);
                        });
                    }
                });

                events = true;
            },

            hasNoAnimation = function ($bgLayers, objectSelector, animPostfix) {

                if (!SUPPORTS_CSS_ANIMATIONS) {

                    return true;
                }

                var $objects = $bgLayers.find(objectSelector);

                if ($objects.css("animation-name") === "none") {

                    return true;
                }

                var animations = $objects[0] && $objects[0].getAnimations ? $objects[0].getAnimations() : [];

                animations = animations.filter(function (animation) {

                    return !!animation.id.match(new RegExp(animPostfix + "$"));
                });

                return animations.length && animations[0].playState === "finished";
            },

            add = function (event, $bgLayers, objectSelector, animPostfix) {

                $layers.push($bgLayers);

                $bgLayers.data(DATA.objectSelector, objectSelector);

                if (!events) {

                    initPerformanceEvents();
                }

                if (hasNoAnimation($bgLayers, objectSelector, animPostfix || ANIM_POSTFIX)) {

                    manualInitAnimations($bgLayers, objectSelector);

                    return;
                }

                $bgLayers.on("animationend." + ns, function (event) {

                    if (event.originalEvent.animationName.match(new RegExp((animPostfix || ANIM_POSTFIX) + "$"))) {

                        animate(event.originalEvent.target);

                        ns.$temp[0] = this;

                        ns.$temp.off("animationend." + ns);
                    }
                });
            },

            init = function () {

                ns.$win.on(EVENT.add, add);
            };

        return {
            init: init
        };
    }());

    if (window.requestIdleCallback) {

        window.requestIdleCallback(ns.$BGObjectsOpacityAnimation.resolve);

    } else {

        setTimeout(ns.$BGObjectsOpacityAnimation.resolve, 0);
    }

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
