/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, HTMLElement*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);
    ns.$win = ns.$win || $(window);

    ns.UIForm = (function () {

        var CLASS = {
                item: "ui__form-item",
                itemError: "ui__form-item--error",
                itemErrorRequired: "ui__form-item--error-required",
                itemErrorRype: "ui__form-item--error-type",
                itemErrorPattern: "ui__form-item--error-pattern",
                itemErrorBadInput: "ui__form-item--error-bad-input",
                itemErrorOverflow: "ui__form-item--error-overflow",
                itemErrorUnderflow: "ui__form-item--error-underflow",
                itemErrorStep: "ui__form-item--error-step",
                itemErrorLong: "ui__form-item--error-long",
                itemErrorShort: "ui__form-item--error-short",
                itemErrorGeneral: "ui__form-item--error-general",

                field: "ui__form-field",

                progress: "ui__form--progress",
                ok: "ui__form--ok",
                error: "ui__form--error",
                validationError: "ui__form--validation-error"
            },

            SELECTOR = {
                forms: ".ui__form:not(.ui__form--no-js)",

                item: "." + CLASS.item,
                itemError: "." + CLASS.itemError,
                field: "." + CLASS.field
            },

            DATA = {
                events: "events.UIForm",

                disabled: "disabled.UIForm",
                error: "error.UIForm"
            },

            $forms,

            clearFormElements = function (formElements) {

                $.each(formElements, function (i, el) {

                    if (!el.disabled && (!el.type || !el.type.match(/submit|button|reset/i))) {

                        ns.$temp[0] = el;

                        ns.$temp.val("");
                    }
                });
            },

            validate = function (formElements) {

                formElements = formElements instanceof HTMLElement ? [formElements] : formElements;

                var errors = null;

                $.each(formElements, function (i, el) {

                    if (el.validity.valid || el.disabled || (el.type && el.type.match(/submit|button|reset/))) {

                        return;
                    }

                    errors = errors || {};

                    if (el.validity.valueMissing) {

                        errors[el.name] = CLASS.itemErrorRequired;

                    } else if (el.validity.typeMismatch) {

                        errors[el.name] = CLASS.itemErrorRype;

                    } else if (el.validity.patternMismatch) {

                        errors[el.name] = CLASS.itemErrorPattern;

                    } else if (el.validity.badInput) {

                        errors[el.name] = CLASS.itemErrorBadInput;

                    } else if (el.validity.rangeOverflow) {

                        errors[el.name] = CLASS.itemErrorOverflow;

                    } else if (el.validity.rangeUnderflow) {

                        errors[el.name] = CLASS.itemErrorUnderflow;

                    } else if (el.validity.stepMismatch) {

                        errors[el.name] = CLASS.itemErrorStep;

                    } else if (el.validity.tooLong) {

                        errors[el.name] = CLASS.itemErrorLong;

                    } else if (el.validity.tooShort) {

                        errors[el.name] = CLASS.itemErrorShort;

                    } else {

                        errors[el.name] = CLASS.itemErrorGeneral;
                    }
                });

                return errors;
            },

            showError = function (formElement, validationErrors) {

                ns.$temp[0] = formElement;

                ns.$temp.data(DATA.error, validationErrors[formElement.name])
                    .closest(SELECTOR.item)
                    .addClass(CLASS.itemError)
                    .addClass(validationErrors[formElement.name]);

                ns.$temp[0] = formElement.form;

                ns.$temp.addClass(CLASS.validationError);
            },

            showErrors = function ($form, validationErrors) {

                $.each(validationErrors, function (name, type) {

                    $form.find("[name='" + name + "']")
                        .data(DATA.error, type)
                        .closest(SELECTOR.item)
                        .addClass(CLASS.itemError)
                        .addClass(type);
                });

                $form.addClass(CLASS.validationError);
            },

            removeError = function (formElement) {

                ns.$temp[0] = formElement;

                ns.$temp.closest(SELECTOR.item)
                    .removeClass(CLASS.itemError)
                    .removeClass(ns.$temp.data(DATA.error))
                    .data(DATA.error, "");

                ns.$temp[0] = formElement.form;

                if (!ns.$temp.find(SELECTOR.itemError).length) {

                    ns.$temp.removeClass(CLASS.validationError);
                }
            },

            removeErrors = function ($form) {

                $.each($form[0].elements, function (i, formElement) {

                    ns.$temp[0] = formElement;

                    if (ns.$temp.data(DATA.error)) {

                        removeError(formElement);
                    }
                });

                $form.removeClass(CLASS.validationError);
            },

            disable = function ($form) {

                $form.data(DATA.disabled, true);
            },

            enable = function ($form) {

                $form.data(DATA.disabled, false);
            },

            isEnabled = function ($form) {

                return !$form.data(DATA.disabled);
            },

            isDisabled = function ($form) {

                return !isEnabled($form);
            },

            clearState = function ($form) {

                $form.removeClass(CLASS.error)
                    .removeClass(CLASS.ok)
                    .removeClass(CLASS.validationError);
            },

            setResultState = function ($form, ok) {

                $form.addClass(ok ? CLASS.ok: CLASS.error)
                    .removeClass(ok ? CLASS.error: CLASS.ok)
                    .removeClass(CLASS.validationError);
            },

            onDone = function () {

                setResultState(this, true);

                clearFormElements(this[0].elements);
            },

            onFail = function () {

                setResultState(this, false);
            },

            createDeferred = function ($form) {

                var $deferred = $.Deferred();

                $deferred.done(onDone.bind($form))
                    .fail(onFail.bind($form))
                    .always(function () {

                        $form.removeClass(CLASS.progress);
                    });

                return $deferred;
            },

            initForms = function () {

                $forms.on("blur.UIForm." + ns, SELECTOR.field, function (event) {

                    removeError(event.target);

                    var validationErrors = validate(event.target);

                    if (validationErrors) {

                        showError(event.target, validationErrors);
                    }
                });

                $forms.on("submit.UIForm." + ns, function (event) {

                    var $form = $forms.filter(function () {
                        return this === event.target;
                    });

                    if (isDisabled($form)) {

                        return;
                    }

                    var validationErrors = validate(event.target.elements),

                        events = $form.data(DATA.events);

                    if (events && events[event.type]) {

                        removeErrors($form);

                        if (events[event.type].call(this, event, createDeferred($form), validationErrors) !== false) {

                            if (validationErrors) {

                                showErrors($form, validationErrors);

                            } else {

                                $form.addClass(CLASS.progress);
                            }

                            event.preventDefault();
                        }

                        return;
                    }

                    if (validationErrors) {

                        showErrors($form, validationErrors);

                        event.preventDefault();
                    }
                });
            },

            on = function ($form, event, cb) {

                if (!$form.jquery) {

                    ns.$temp[0] = $form;

                    $form = ns.$temp;
                }

                var events = $form.data(DATA.events) || {};

                events[event] = cb;

                $form.data(DATA.events, events);
            },

            init = function () {

                $forms = $(SELECTOR.forms);

                $forms.attr("novalidate", "true");

                initForms();
            };

        return {
            init: init,

            on: on,

            clearState: clearState,

            disable: disable,
            enable: enable,
            isDisabled: isDisabled,
            isEnabled: isEnabled
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
