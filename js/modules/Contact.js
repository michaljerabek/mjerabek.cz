/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);
    ns.$win = ns.$win || $(window);

    ns.Contact = (function () {

        var CLASS = {
                parallaxDestroyed: "contact--no-parallax",
                speachBubbleVisible: "speach--visible",

                showFormInfo: "contact__form--show-info",

                hideText: "contact__form-btn--hide-text"
            },

            SELECTOR = {
                self: ".contact",

                background: ".contact__background",
                backgroundLayers: ".contact__background-layer",
                findSpeechBubble: ".speach",

                form: ".contact__form",
                formInfo: ".contact__form-info",
                formInfoLink: ".contact__form-info-link",
                formSubmit: ".contact__form-btn",
                findBtnText: ".text"
            },

            DATA = {
                okMsg: "contact-ok",
                errorMsg: "contact-error"
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

            MSG_DURATION = 4000,
            MSG_FADE_DURATION = 250,
            MSG_QUEUE = "Contact.msg." + ns,

            $self,
            $form,
            $formInfo,
            $formInfoLink,
            $formSubmit,
            $formBtnText,

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

                ns.BGObjectsOpacityAnimation.add($bgLayers, SELECTOR.findSpeechBubble, "--slide-in");

                ns.$win.on("scroll.Contact." + ns, function () {

                    var selfRect = $self[0].getBoundingClientRect();

                    if (selfRect.bottom - window.innerHeight <= window.innerHeight / 2) {

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

                if (typeof document.body.style.webkitOverflowScrolling === "undefined" && !document.documentElement.className.match(/android/)) {

                    $formInfo.mCustomScrollbar(SCROLL_OPTIONS);
                }
            },

            send = function () {

                var $deffered = $.Deferred();

                setTimeout(function() {

                    $deffered.resolve(!!Math.round(Math.random()));

                }, (Math.random() * 2000) + 100);

                return $deffered;
            },

            showMsg = function (ok, onBackToInitState) {

                var originalMsg = $formBtnText.text();

                $formSubmit.addClass(CLASS.hideText)
                    .delay(MSG_FADE_DURATION, MSG_QUEUE)
                    .queue(MSG_QUEUE, function (next) {

                        $formBtnText.text(
                            $formSubmit.data(DATA[ok ? "okMsg" : "errorMsg"])
                        );

                        $formSubmit.removeClass(CLASS.hideText);

                        setTimeout(function() {

                            $formSubmit.addClass(CLASS.hideText)
                                .delay(MSG_FADE_DURATION, MSG_QUEUE)
                                .queue(MSG_QUEUE, function (next) {

                                    $formBtnText.css("transition-delay", "0s")
                                        .text(originalMsg);

                                    $formSubmit.removeClass(CLASS.hideText);

                                    if (onBackToInitState) {

                                        onBackToInitState();
                                    }

                                    $formSubmit.delay(MSG_FADE_DURATION, MSG_QUEUE)
                                        .queue(MSG_QUEUE, function (next) {

                                            $formBtnText.css("transition-delay", "");

                                            next();
                                        });

                                    next();

                            }).dequeue(MSG_QUEUE);

                        }, MSG_DURATION);

                        next();

                }).dequeue(MSG_QUEUE);
            },

            initForm = function () {

                $form = $self.find(SELECTOR.form);

                initFormInfo();

                $formSubmit = $form.find(SELECTOR.formSubmit);

                $formBtnText = $formSubmit.find(SELECTOR.findBtnText);

                ns.Form.on($form, "submit", function (event, $deferred, errors) {

                    ns.Form.disable($form);

                    $formSubmit.blur()
                        .dequeue(MSG_QUEUE);

                    if (errors) {

                        showMsg(false, function() {

                            ns.Form.enable($form);
                        });

                        return;
                    }

                    send().then(function (ok) {

                        $deferred[ok ? "resolve" : "reject"]();

                        showMsg(ok, function() {

                            ns.Form.enable($form);

                            ns.Form.clearState($form);
                        });
                    });
                });
            },

            init = function () {

                $self = $(SELECTOR.self);

                initForm();

                initBackground();
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
