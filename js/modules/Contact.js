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

                hideText: "contact__form-btn--hide-text",
                sending: "ui__form--progress",
                ok: "ui__form--ok",
                error: "ui__form--error"
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
                okMsg: "ui-form-ok",
                errorMsg: "ui-form-error"
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

            MSG_DURATION = 5000,
            MSG_FADE_DURATION = 250,
            MSG_QUEUE = "Contact.msg." + ns,

            $self,
            $form,
            $formInfo,
            $formInfoLink,
            $formSubmit,
            $formBtnText,

            errors,

            isFormDisabled = false,

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

            clearFormElements = function (formElements) {

                $.each(formElements, function (i, el) {

                    if (el !== $formSubmit[0]) {

                        ns.$temp[0] = el;

                        ns.$temp.val("");
                    }
                });
            },

            validate = function (formElements) {

                formElements = formElements instanceof HTMLElement ? [formElements] : formElements;

                errors = null;

                var elements = [];

                $.each(formElements, function (i, el) {

                    if (el !== $formSubmit[0]) {

                        elements.push(el);
                    }
                });

                elements.forEach(function (el) {

                    if (el.validity.valid) {

                        return;
                    }

                    errors = errors || {};

                    if (el.validity.valueMissing) {

                        errors[el.name] = "ui__form-item--error-required";

                    } else if (el.validity.typeMismatch) {

                        errors[el.name] = "ui__form-item--error-type";

                    } else {

                        errors[el.name] = "ui__form-item--error-general";
                    }
                });

                return !errors;
            },

            send = function () {

                var $deffered = $.Deferred();

                setTimeout(function() {

                    $deffered.resolve(!!Math.round(Math.random()));

                }, (Math.random() * 2000) + 100);

                return $deffered;
            },

            showMsg = function (ok) {

                var originalMsg = $formBtnText.text();

                $formBtnText.text(
                    $formSubmit.data(DATA[ok ? "okMsg" : "errorMsg"])
                );

                $form.removeClass(CLASS.sending);

                $form.addClass(ok ? CLASS.ok : CLASS.error);

                setTimeout(function() {

                    $formSubmit.addClass(CLASS.hideText)
                        .delay(MSG_FADE_DURATION, MSG_QUEUE)
                        .queue(MSG_QUEUE, function (next) {

                            $formBtnText.css("transition-delay", "0s")
                                .text(originalMsg);

                            $formSubmit.removeClass(CLASS.hideText);

                            $formSubmit.delay(MSG_FADE_DURATION, MSG_QUEUE)
                                .queue(MSG_QUEUE, function (next) {

                                    $formBtnText.css("transition-delay", "");

                                    next();
                                });

                            next();

                        }).dequeue(MSG_QUEUE);

                    $form.removeClass(ok ? CLASS.ok : CLASS.error);

                }, MSG_DURATION);
            },

            showErrors = function () {

                $.each(errors, function (name, type) {

                    $form.find("[name='" + name + "']")
                        .data("error.UIForm", type)
                        .closest(".ui__form-item")
                        .addClass("ui__form-item--error")
                        .addClass(type);
                });
            },

            removeError = function (formElement) {

                ns.$temp[0] = formElement;

                ns.$temp.closest(".ui__form-item")
                    .removeClass("ui__form-item--error")
                    .removeClass(ns.$temp.data("error.UIForm"))
                    .data("error.UIForm", "");
            },

            removeErrors = function () {

                $.each(errors, function (name) {

                    removeError($form.find("[name='" + name + "']")[0]);
                });
            },

            initForm = function () {

                initFormInfo();

                $formSubmit = $form.find(SELECTOR.formSubmit);

                $formBtnText = $formSubmit.find(SELECTOR.findBtnText);

                $form.on("blur." + ns, ".ui__form-field", function (event) {

                    removeError(event.target);

                    if (!validate(event.target)) {

                        showErrors();
                    }
                });

                $form.on("focusin." + ns, ".ui__form-field", function (event) {

                    removeError(event.target);
                });

                $form.on("submit." + ns, function (event) {

                    if (isFormDisabled) {

                        return false;
                    }

                    isFormDisabled = true;

                    removeErrors();

                    $formSubmit.dequeue(MSG_QUEUE)
                        .blur()
                        .prop("disabled", true);

                    if (validate(event.target.elements)) {

                        $form.addClass(CLASS.sending);

                        send().then(function (ok) {

                            showMsg(ok);

                            if (ok) {

                                clearFormElements(event.target.elements);
                            }

                            setTimeout(function() {

                                $formSubmit.prop("disabled", false);

                                isFormDisabled = false;

                            }, MSG_DURATION);
                        });

                    } else {

                        showErrors();

                        showMsg(false);

                        setTimeout(function() {

                            $formSubmit.prop("disabled", false);

                            isFormDisabled = false;

                        }, MSG_DURATION);
                    }

                    event.preventDefault();
                });
            },

            init = function () {

                $self = $(SELECTOR.self);

                $form = $self.find(SELECTOR.form);

                initForm();

                initBackground();
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
