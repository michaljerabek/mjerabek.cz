/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);
    ns.$win = ns.$win || $(window);

    ns.Contact = (function () {

        var CLASS = {
                parallaxDestroyed: "contact--no-parallax",
                speachBubbleVisible: "speach--visible",

                showFormInfo: "contact__form--show-info"

            },

            SELECTOR = {
                self: ".contact",

                background: ".contact__background",
                backgroundLayers: ".contact__background-layer",
                findSpeechBubble: ".speach",

                form: ".contact__form",
                formInfo: ".contact__form-info",
                formInfoLink: ".contact__form-info-link",
                formSubmit: ".contact__form-btn"
            },

            SCROLL_OPTIONS = {
                axis: "y",
                theme: "minimal",
                scrollInertia: 500,
                mouseWheel:{
                    scrollAmount: 162,
                    deltaFactor: 27
                }
            },

            $self,
            $form,
            $formInfo,
            $formInfoLink,

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

                ns.BGObjectsOpacityAnimation.add($bgLayers, SELECTOR.findSpeechBubble);

                ns.$win.on("scroll.Contact." + ns, function () {

                    var selfRect = $self[0].getBoundingClientRect();

                    if (selfRect.top + (selfRect.height / 2) < window.innerHeight) {

                        $bgLayers.find(SELECTOR.findSpeechBubble)
                            .addClass(CLASS.speachBubbleVisible);

                        ns.$win.off("scroll.Contact." + ns);
                    }
                });
            },

            initFormInfo = function () {

                $formInfo = $form.find(SELECTOR.formInfo);

                $formInfoLink = $form.find(SELECTOR.formInfoLink);

                $formInfoLink.on("click." + ns, function (event) {

                    $form.toggleClass(CLASS.showFormInfo);

                    event.preventDefault();
                });

                if (typeof document.body.style.webkitOverflowScrolling === "undefined") {

                    $formInfo.mCustomScrollbar(SCROLL_OPTIONS);
                }
            },

            init = function () {

                $self = $(SELECTOR.self);

                $form = $self.find(SELECTOR.form);

                initFormInfo();

                initBackground();
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
