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

                sendErrorActive: "contact__form-send-error--active",

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
                findBtnText: ".text",

                sendError: ".contact__form-send-error"
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

            hasCustomScrollbar = false,

            $self,
            $form,
            $formInfo,
            $formInfoLink,
            $formSubmit,
            $formBtnText,
            $sendError,

            sendErrorMsgType = 0,

            $bgLayers,
            parallax,

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

                        ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSpeechBubble, "--slide-in"]);

                        ns.$win.trigger("scroll.Contact." + ns);

                    }, 200);
                });

                var scrollDebounce = null;

                ns.$win.on("scroll.Contact." + ns, function () {

                    clearTimeout(scrollDebounce);

                    scrollDebounce = setTimeout(function() {

                        var selfRect = $self[0].getBoundingClientRect();

                        if (selfRect.bottom - window.innerHeight <= window.innerHeight / 2) {

                            $bgLayers.find(SELECTOR.findSpeechBubble)
                                .addClass(CLASS.speachBubbleVisible);

                            ns.$win.off("scroll.Contact." + ns);
                        }
                    }, 50);
                });
            },

            initCustomScrollbar = function () {

                if (!$.fn.mCustomScrollbar || hasCustomScrollbar) {

                    return;
                }

                $formInfo.mCustomScrollbar(SCROLL_OPTIONS);

                hasCustomScrollbar = true;
            },

            initFormInfo = function () {

                $formInfo = $form.find(SELECTOR.formInfo);
                $formInfoLink = $form.find(SELECTOR.formInfoLink);

                $formInfoLink.on("click." + ns, function (event) {

                    event.preventDefault();

                    $form.toggleClass(CLASS.showFormInfo);

                    initCustomScrollbar();
                });
            },

            getFormData = function () {

                var data = {};

                $.each($form[0].elements, function (i, element) {

                    data[element.name] = element.value;
                });

                return data;
            },

            send = function () {

                var data = getFormData();

                data.ajax = true;

                return $.post($form.attr("action"), data, "json");
            },

            showMsg = function (ok, sendError, onBackToInitState) {

                var originalMsg = $formBtnText.text();

                if (sendError) {

                    $sendError = $sendError || $form.find(SELECTOR.sendError);

                    $sendError.eq(Math.min(sendErrorMsgType++, $sendError.length - 1))
                        .addClass(CLASS.sendErrorActive);
                }

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

                    if ($sendError) {

                        $sendError.removeClass(CLASS.sendErrorActive);
                    }

                    if (errors) {

                        showMsg(false, false, function() {

                            ns.Form.enable($form);
                        });

                        return;
                    }

                    send().then(function (result) {

                        $deferred[result.ok ? "resolve" : "reject"](result.validationErrors);

                        showMsg(result.ok, !result.ok && !result.validationErrors, function() {

                            ns.Form.enable($form);

                            ns.Form.clearState($form);
                        });
                    });
                });
            },

            init = function () {

                $self = $(SELECTOR.self);

                initForm();

                ns.$ParallaxLoader.then(function () {

                    setTimeout(initBackground, 200);
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
