/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, HTMLElement*/

/* Form
 *
 * Zajišťuje validaci formulářů pomocí Constraint Validation API.
 *
 * HTML:
 * <form class="form" method="post" action="/send">
 *     <div class="form__item">
 *       <label for="name" class="form__label"></label>
 *       <input class="form__field" id="name" type="text" name="name" pattern="[a-z]+" required>
 *       <p class="form__error form__error--required">Toto pole je povinné.</p>
 *       <p class="form__error form__error--pattern">Špatný formát.</p>
 *   </div>
 *   <div class="form__item">
 *       <button class="form__submit">Odeslat</button>
 *   </div>
 * </form>
 *
 * Pro použití pouze stylů je možné přidat třídu "form--no-js".
 *
 * Princip fungování:
 * Pokud není k formuláři přiřazen handler události "submit" (viz dále),
 * tak pokud je formulář validní odešle se normálním způsobem podle atributu "action".
 * Pokud validní není, neodešle se a položkám (".form__item") se přiřadí třídy podle
 * porušených pravidel (viz objekt "CLASS"). Na základě této třídy se zobrazí přislušná
 * informace o chybě (".form__error").
 *
 * Pokud je přiřazen handler události "submit" pomocí metody "on" (viz API modulu)
 * a handler nevrátí false, očekává se, že odeslání formuláře zajistí AJAX. Pokud
 * formulář validní není, položkám (".form__item") se přiřadí třídy podle porušených
 * pravidel (viz objekt "CLASS"). Na základě této třídy se zobrazí přislušná informace
 * o chybě (".form__error"). (Handler události se spustí i při nevalidním formuláři.)
 *
 * Při odesílání získá formulář třídu "form--progress". Při úspěšném odeslání formuláře
 * získá třídu "form--ok", jinak "form--error".
 */

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);
    ns.$win = ns.$win || $(window);

    ns.Form = (function () {

        var CLASS = {
                disabled: "form--disabled",
                progress: "form--progress",
                ok: "form--ok",
                error: "form--error",
                validationError: "form--validation-error",

                item: "form__item",
                itemError: "form__item--error",
                itemErrorRequired: "form__item--error-required",
                itemErrorRype: "form__item--error-type",
                itemErrorPattern: "form__item--error-pattern",
                itemErrorBadInput: "form__item--error-bad-input",
                itemErrorOverflow: "form__item--error-overflow",
                itemErrorUnderflow: "form__item--error-underflow",
                itemErrorStep: "form__item--error-step",
                itemErrorLong: "form__item--error-long",
                itemErrorShort: "form__item--error-short",
                itemErrorGeneral: "form__item--error-general",

                field: "form__field"
            },

            SELECTOR = {
                forms: ".form:not(.form--no-js)",

                item: "." + CLASS.item,
                itemError: "." + CLASS.itemError,
                field: "." + CLASS.field,
                submit: ".form__submit"
            },

            DATA = {
                events: "events.Form",

                error: "error.Form"
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

                $form.addClass(CLASS.disabled)
                    .find(SELECTOR.submit)
                    .prop("disabled", true);
            },

            enable = function ($form) {

                $form.removeClass(CLASS.disabled)
                    .find(SELECTOR.submit)
                    .prop("disabled", false);
            },

            isEnabled = function ($form) {

                return !$form.hasClass(CLASS.disabled);
            },

            isDisabled = function ($form) {

                return !isEnabled($form);
            },

            clearState = function ($form, preserveValidationError) {

                $form.removeClass(CLASS.error)
                    .removeClass(CLASS.ok);

                if (!preserveValidationError) {

                    $form.removeClass(CLASS.validationError);
                }
            },

            setResultState = function ($form, ok, preserveValidationError) {

                $form.addClass(ok ? CLASS.ok: CLASS.error)
                    .removeClass(ok ? CLASS.error: CLASS.ok);

                if (!preserveValidationError) {

                    $form.removeClass(CLASS.validationError);
                }
            },

            onDone = function () {

                setResultState(this, true);

                clearFormElements(this[0].elements);
            },

            onFail = function (validationFailed, customErrors) {

                if (customErrors) {

                    removeErrors(this);

                    showErrors(this, customErrors);
                }

                setResultState(this, false, validationFailed || (customErrors && !$.isEmptyObject(customErrors)));
            },

            createDeferred = function ($form, validationErrors) {

                var $deferred = $.Deferred();

                return $deferred.done(onDone.bind($form))
                    .fail(onFail.bind($form, validationErrors))
                    .always(function () {

                        $form.removeClass(CLASS.progress);
                    });
            },

            initForms = function () {

                $forms.on("blur.Form." + ns, SELECTOR.field, function (event) {

                    removeError(event.target);

                    var validationErrors = validate(event.target);

                    if (validationErrors) {

                        showError(event.target, validationErrors);
                    }
                });

                $forms.on("submit.Form." + ns, function (event) {

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

                        var $deferred = createDeferred($form, validationErrors);

                        if (events[event.type].call(this, event, $deferred, validationErrors) !== false) {

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

            /* Přiřazuje formuláři handler událostí.
             *
             * $form (jQuery) - element formuláře
             * event (String) - název události ("submit")
             * cb (Function) - handler události
             *
             * Argumenty handleru (cb):
             * event (Object) - Původní objekt události
             * $deferred ($.Deferred) - "promise" - po zpracování AJAXu se zavolá
             *     metoda "resolve" nebo "reject" podle výsledku. "Reject" může
             *     v prvním parametru poslat vlastní objekt s chybami ve formátu
             *     { name: "form__item--error-required" } - C. V. API není vždy
             *     spolehlivé, může se tak hodit pro zobrazení validace na serveru.
             * validationErrors (Object) - objekt s chybami nebo null
             */
            on: on,

            /* Odstraní stav (ok | error | validation-error) formuláře.
             * $form (jQuery) - element formuláře
             *
             * preserveValidationError? (Boolean) - odstraní stav odeslání formuláře,
             *     ale zachová stav validation-error
             */
            clearState: clearState,

            /* Následující metody vypnou/zapnout formulář nebo zjistí jeho stav.
             * Při vypnutí formuláře se nastaví ".form__submit" atribut "disabled"
             * a formulář nepůjde odeslat.
             *
             * $form (jQuery) - element formuláře
             */
            disable: disable,
            enable: enable,
            isDisabled: isDisabled,
            isEnabled: isEnabled
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
