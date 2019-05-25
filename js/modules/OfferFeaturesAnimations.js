/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.$OfferFeaturesAnimations = ns.$OfferFeaturesAnimations || $.Deferred();

    ns.OfferFeaturesAnimations = (function () {

        $.easing[ns + ".Offer__light-on"] = function (x) {
            return x * x * x;
        };

        $.easing[ns + ".Offer__light-off"] = function (x) {
            return Math.sqrt(1 - Math.pow(x - 1, 2));
        };

        var CLASS = {
                lightOn: "offer--light-on",
                hasFeaturesAnims: "offer--has-features-anims",

                featureIconDefaultAnim: "offer__feature-icon--default-anim",
                featureIconNoDefaultAnim: "offer__feature-icon--no-default-anim",
                featureIconHiddenAnim: "offer__feature-icon--hidden-anim",
                featureIconBreakGears: "offer__feature-icon--break-gears",
                featureIconRepairGears: "offer__feature-icon--repair-gears",
                featureIconBreakGlass: "offer__feature-icon--break-glass",
                featureIconRepairGlass: "offer__feature-icon--repair-glass",

                btnLight: "btn--light",
                btnDark: "btn--dark"
            },

            SELECTOR = {
                findCenter: ".layout__center",
                findBtn: ".btn",

                light: ".offer__light",

                featureIcon: ".offer__feature-icon",
                featureIconManual: ".offer__feature--manual .offer__feature-icon",
                featureIconSystem: ".offer__feature--system .offer__feature-icon",
                featureIconOptimization: ".offer__feature--optimization .offer__feature-icon"
            },

            EVENT = {
                defaultAnimEnd: "offer__defaultanimationend",
                hiddenAnimEnd: "offer__hiddenanimationend"
            },

            FEATURE_ICON_ANIM_INTERVAL = 6000,
            FEATURE_ICON_ANIM_DEFAULT_PREFIX = /^offer__default-anim/,
            FEATURE_ICON_ANIM_IGNORE_PREFIX = /^offer__x-/,

            LIGHT_BGC_RGB = "240, 237, 227",
            LIGHT_ON_DURATION = 200,
            LIGHT_OFF_DURATION = 450,

            $offer,

            getFeaturesAnimIndex = function (lastIndex, count) {

                var index = Math.ceil(Math.random() * count) - 1;

                return index === lastIndex ? getFeaturesAnimIndex(lastIndex, count) : index;
            },

            initLigth = function ($toggleIcon) {

                var $light, $btn, centerEl;

                $toggleIcon.on("click." + ns, function (event) {

                    event.preventDefault();

                    $light = $light || $offer.find(SELECTOR.light);
                    $btn = $btn || $offer.find(SELECTOR.findBtn);
                    centerEl = centerEl || $offer.find(SELECTOR.findCenter)[0];

                    var iconPosition = $toggleIcon.position(),

                        iconCenter = [
                            centerEl.offsetLeft + iconPosition.left + ($toggleIcon.outerWidth() / 2),
                            centerEl.offsetTop + iconPosition.top + ($toggleIcon.outerHeight() / 2)
                        ],

                        isLightOn = $offer.hasClass(CLASS.lightOn);

                        $light.stop().animate({textIndent: isLightOn ? 0: 1}, {
                            duration: isLightOn ? LIGHT_OFF_DURATION: LIGHT_ON_DURATION,
                            easing: isLightOn ? ns + ".Offer__light-off": ns + ".Offer__light-on",

                            step: function (progress) {

                                $light.css({
                                    background: "radial-gradient(circle at " + iconCenter[0] + "px " + iconCenter[1] + "px, rgb(" + LIGHT_BGC_RGB + ") " + (progress * 100) + "%, rgba(" + LIGHT_BGC_RGB + ", 0) 100%)",
                                    opacity: progress
                                });
                            }
                        });

                        if (isLightOn) {

                            $offer.removeClass(CLASS.lightOn);

                            $btn.removeClass(CLASS.btnDark)
                                .addClass(CLASS.btnLight);

                        } else {

                            $offer.addClass(CLASS.lightOn);

                            $btn.removeClass(CLASS.btnLight)
                                .addClass(CLASS.btnDark);
                        }
                });
            },

            initGears = function ($toggleIcon)  {

                var animateLater = false;

                $toggleIcon.on("click." + ns, function (event) {

                    event.preventDefault();

                    if (!$toggleIcon.hasClass(CLASS.featureIconDefaultAnim) && !$toggleIcon.hasClass(CLASS.featureIconHiddenAnim)) {

                        if ($toggleIcon.hasClass(CLASS.featureIconBreakGears)) {

                            $toggleIcon.removeClass(CLASS.featureIconBreakGears)
                                .addClass(CLASS.featureIconRepairGears)
                                .addClass(CLASS.featureIconHiddenAnim);

                        } else {

                            $toggleIcon.addClass(CLASS.featureIconBreakGears)
                                .removeClass(CLASS.featureIconRepairGears)
                                .addClass(CLASS.featureIconHiddenAnim);
                        }

                        return;
                    }

                    animateLater = true;
                });

                ns.$win.on([EVENT.defaultAnimEnd, EVENT.hiddenAnimEnd].join(" "), function (event, iconEl) {

                    if (iconEl === $toggleIcon[0]) {

                        if (event.type === EVENT.hiddenAnimEnd && $toggleIcon.hasClass(CLASS.featureIconRepairGears)) {

                            $toggleIcon.removeClass(CLASS.featureIconRepairGears);
                        }

                        if (animateLater) {

                            animateLater = false;

                            $toggleIcon.click();
                        }
                    }
                });
            },

            initGlass = function ($toggleIcon)  {

                var animateLater = false;

                $toggleIcon.on("click." + ns, function (event) {

                    event.preventDefault();

                    if (!$toggleIcon.hasClass(CLASS.featureIconDefaultAnim) && !$toggleIcon.hasClass(CLASS.featureIconHiddenAnim)) {

                        if ($toggleIcon.hasClass(CLASS.featureIconBreakGlass)) {

                            $toggleIcon.removeClass(CLASS.featureIconBreakGlass)
                                .addClass(CLASS.featureIconRepairGlass)
                                .addClass(CLASS.featureIconHiddenAnim)
                                .removeClass(CLASS.featureIconNoDefaultAnim);

                        } else {

                            $toggleIcon.addClass(CLASS.featureIconBreakGlass)
                                .removeClass(CLASS.featureIconRepairGlass)
                                .addClass(CLASS.featureIconHiddenAnim)
                                .addClass(CLASS.featureIconNoDefaultAnim);
                        }

                        return;
                    }

                    animateLater = true;
                });

                ns.$win.on([EVENT.defaultAnimEnd, EVENT.hiddenAnimEnd].join(" "), function (event, iconEl, targetEl) {

                    if (iconEl === $toggleIcon[0]) {

                        ns.$temp[0] = targetEl;

                        if (ns.$temp.closest("defs").length) {

                            return;
                        }

                        if (event.type === EVENT.hiddenAnimEnd && $toggleIcon.hasClass(CLASS.featureIconRepairGlass)) {

                            $toggleIcon.removeClass(CLASS.featureIconRepairGlass);
                        }

                        if (animateLater) {

                            animateLater = false;

                            $toggleIcon.click();
                        }
                    }
                });
            },

            initFeaturesAnim = function () {

                var $featureIcon = $offer.find(SELECTOR.featureIcon),
                    lastAnimIndex = -1;

                $featureIcon.on("animationend." + ns, function (event) {

                    if (event.originalEvent.animationName.match(FEATURE_ICON_ANIM_IGNORE_PREFIX)) {

                        return;
                    }

                    if (event.originalEvent.animationName.match(FEATURE_ICON_ANIM_DEFAULT_PREFIX)) {

                        ns.$temp[0] = event.currentTarget;

                        ns.$temp.removeClass(CLASS.featureIconDefaultAnim);

                        ns.$win.trigger(EVENT.defaultAnimEnd, [event.currentTarget, event.target, event.originalEvent.animationName]);

                        return;
                    }

                    ns.$temp[0] = event.currentTarget;

                    ns.$temp.removeClass(CLASS.featureIconHiddenAnim);

                    ns.$win.trigger(EVENT.hiddenAnimEnd, [event.currentTarget, event.target, event.originalEvent.animationName]);
                });

                var animateIconInterval = function () {

                    var index = lastAnimIndex === -1 ? 1 : getFeaturesAnimIndex(lastAnimIndex, $featureIcon.length),

                        $icon = $featureIcon.eq(index);

                    lastAnimIndex = index;

                    if ($icon.hasClass(CLASS.featureIconHiddenAnim) || $icon.hasClass(CLASS.featureIconNoDefaultAnim)) {

                        if ($featureIcon.not("." + CLASS.featureIconHiddenAnim).not("." + CLASS.featureIconNoDefaultAnim).length > 0) {

                            animateIconInterval();
                        }

                        return;
                    }

                    $icon.addClass(CLASS.featureIconDefaultAnim);
                };

                setTimeout(function () {

                    animateIconInterval();

                    setInterval(animateIconInterval, FEATURE_ICON_ANIM_INTERVAL);

                }, FEATURE_ICON_ANIM_INTERVAL / 10);

                initLigth($featureIcon.filter(SELECTOR.featureIconManual));
                initGears($featureIcon.filter(SELECTOR.featureIconSystem));
                initGlass($featureIcon.filter(SELECTOR.featureIconOptimization));
            },

            init = function () {

                $offer = ns.Offer.getSelf();

                $offer.addClass(CLASS.hasFeaturesAnims);

                initFeaturesAnim();
            };

        return {
            init: init
        };

    }());

    if (window.requestIdleCallback) {

        window.requestIdleCallback(ns.$OfferFeaturesAnimations.resolve);

    } else {

        setTimeout(ns.$OfferFeaturesAnimations.resolve, 0);
    }

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
