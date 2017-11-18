/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax, ParallaxController*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.AboutMe = (function () {

        var SELECTOR = {
                self: ".about-me",

                photo: ".about-me__photo",
                photoImg: ".about-me__img"
            },

            PHOTO_FILTER = 20,

            parallax,
            useFilter = true,
            $img = null,

            applyPhotoFilter = function ($el, progress) {

                if (!useFilter) {

                    return;
                }

                $img = $img || $el.find(SELECTOR.photoImg);

                var recalc = progress > 0 ? Math.max(-1 + (progress * 2), 0) : Math.min(1 + (progress * 2), 0);

                recalc = Math.abs(recalc);

                var filter = (recalc * PHOTO_FILTER).toFixed(3);

                $img.css("filter", "blur(" + filter + "px)");
            },

            checkPhotoPosition = function () {

                var selfRect = parallax.$parallax[0].getBoundingClientRect(),
                    photoRect = parallax.$layers[0].getBoundingClientRect();

                if (photoRect.bottom < selfRect.bottom) {

                    ParallaxController.refresh(true);

                    setTimeout(checkPhotoPosition, 1000);
                }
            },

            init = function (debug) {

                setTimeout(function() {

                    parallax = new Parallax({
                        parallax: SELECTOR.self,
                        layers: SELECTOR.photo,
                        fakeTilt: false,

                        onTransform: applyPhotoFilter
                    });

                    ns.$win.on("lowperformance." + ns, function () {

                        useFilter = false;

                        parallax.$layers.find(SELECTOR.photoImg)
                            .css("filter", "none");
                    });

                    if (debug) {

                        ns.$win.on("resize", function () {

                            ns.$win.scrollTop($(SELECTOR.self).offset().top);
                        });
                    }
                }, 100);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

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

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);

    ns.BreakText = (function () {

        var CLASS = {
                word: "word",
                letter: "letter",
                space: "space"
            },

            SELECTOR = {
                items: "[data-break-text='true']"
            },

            wrapLetter = function (letter, num, smallCaps) {

                var attrs = [
                        "class=\"", CLASS.letter + num, "\" style=\"display: inline-block;\"",
                        smallCaps ? ns.SmallCaps.getAttr(true) : ""
                    ].join(" ");

                return "<span " + attrs + ">" + letter + "</span>";
            },

            getWhiteSpace = function (num) {

                return "<span class=\"" + (CLASS.space + num) + "\" style=\"white-space: pre;\"> </span>";
            },

            breakWord = function (word, num, hasSmallCaps) {

                var wordData = [],
                    l = 0;

                wordData.push("<span class=\"" + (CLASS.word + num) + "\" style=\"display: inline-block;\">");

                for (l; l < word.length; l++) {

                    wordData.push(wrapLetter(word[l], l + 1, hasSmallCaps));
                }

                wordData.push("</span>");

                return wordData;
            },

            breakText = function ($item, hasSmallCaps) {

                var text = $item.text().trim(),
                    words = text.split(/\s/),

                    textData = [],
                    w = 0;

                for (w; w < words.length; w++) {

                    textData = textData.concat(breakWord(words[w], w + 1, hasSmallCaps));

                    if (w < words.length - 1) {

                        textData.push(getWhiteSpace(w + 1));
                    }
                }

                return textData;
            },

            processElement = function (i, el) {

                ns.$temp[0] = el;

                var hasSmallCaps = ns.SmallCaps.isItem(ns.$temp),

                    result = breakText(ns.$temp, hasSmallCaps);

                if (hasSmallCaps) {

                    ns.SmallCaps.removeItem(ns.$temp);
                }

                ns.$temp.html(result.join(""));
            },

            init = function () {

                var items = document.querySelectorAll(SELECTOR.items),

                    length = items.length,
                    i = 0;

                for (i; i < length; i++) {

                    processElement(i, items[i]);
                }
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns) {

    ns.ConsoleMessage = (function () {

        var STYLES = "font-family: 'josefin-sans'; font-size: 17px; font-weight: 400; line-height: 27px; color: #7D6937;",

            MSG_IDENTIFIER = /^-/,

            init = function () {

                Array.prototype.slice.call(document.head.childNodes).forEach(function (node) {

                    if (node.nodeType === 8 && node.textContent.match(MSG_IDENTIFIER)) {

                        var message = node.textContent.replace(MSG_IDENTIFIER, "").replace(/\s+/g, " ").trim();

                        if (navigator.userAgent.match(/firefox|chrome/i)) {

                            console.log("%c" + message, STYLES);

                            return false;
                        }

                        console.log(message);

                        return false;
                    }
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS"))));

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

                    ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSpeechBubble, "--slide-in"]);

                    ns.$win.trigger("scroll.Contact." + ns);

                }, 200);

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

                setTimeout(initBackground, 200);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, cookieconsent*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.Cookies = (function () {

        var CLASS = {
                fadeOut: "cookies--fade-out"
            },

            TEMPLATE = [
                "<div class=\"cookies x-print cc-window\" role=\"dialog\" aria-label=\"cookieconsent\" aria-describedby=\"cookieconsent:desc\">",
                    "<div class=\"layout__center\">",
                        "<span class=\"cookies__message cc-message\" id=\"cookieconsent:desc\">Tento web používá k analýze návštěvnosti soubory cookies. <a class=\"cookies__link cc-link\" tabindex=\"0\" href=\"http://cookiesandyou.com\" target=\"_blank\" lang=\"en\" aria-label=\"Dozvědět se více o cookies\">Více informací zde <i>(en)</i></a>.</span>",
                        "<div class=\"cookies__compliance cc-compliance\">",
                            "<a class=\"cookies__dismiss btn btn--dark btn--small cc-dismiss cc-btn\" aria-label=\"Zavřít zprávu o cookies\" tabindex=\"0\"><span class=\"text cc-btn cc-dismiss\"><span class=\"small cc-btn cc-dismiss\">OK</span></span></a>",
                        "</div>",
                    "</div>",
                "</div>"
            ].join(""),

            onPopupOpen = function () {

                if (ns.$win.scrollTop()) {

                    this.element.style.transitionDelay = "0s";
                }
            },

            onPopupClose = function () {

                if (typeof this.element.style.transition !== "undefined") {

                    this.element.style.transitionDelay = "";

                    this.element.className += (" " + CLASS.fadeOut);

                    this.element.addEventListener("transitionend", function onCookeisCloseTransitionend(event) {

                        if (event.target === this.element) {

                            this.element.className = this.element.className.replace(" " + CLASS.fadeOut, "");

                            this.element.removeEventListener("transitionend", onCookeisCloseTransitionend);
                        }
                    }.bind(this));
                }
            },

            init = function () {

                cookieconsent.initialise({
                    autoOpen: true,
                    overrideHTML: TEMPLATE,
                    onPopupOpen: onPopupOpen,
                    onPopupClose: onPopupClose,
                    cookie: {
                        expiryDays: window.location.host.match(/127\.0\.0\.1/) ? 0.000695 : 365
                    }
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns, $) {

    ns.FixBugs = (function () {

        ns.$win = ns.$win || $(window);

        var SELECTOR = {
                UIPerspective: ".ui__perspective"
            },

            NS = ns + ".FixBugs",

            $UIPerspective,

            fixUIPerspectiveInIEAndEdge = function () {

                if (!window.navigator.userAgent.match(/Trident|Edge/)) {

                    return;
                }

                var debounce;

                ns.$win.on("scroll." + NS, function () {

                    clearTimeout(debounce);

                    debounce = setTimeout(function() {

                        $UIPerspective = ($UIPerspective || $(SELECTOR.UIPerspective))
                            .css("perspective", "none")
                            .delay(25, NS)
                            .queue(NS, function () {

                                $UIPerspective.css("perspective", "");
                            })
                            .dequeue(NS);
                    }, 250);
                });

                ns.$win.trigger("scroll." + NS);
            },

            init = function () {

                fixUIPerspectiveInIEAndEdge();
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns) {

    ns.Fonts = (function () {

        var CLASS = {
                caudexLoaded: "fonts__caudex--loaded"
            },

            init = function () {

                if (document.fonts) {

                    document.fonts.ready.then(function () {

                        var CaudexLoaded = false;

                        document.fonts.forEach(function (font) {

                            if (font.family.replace(/["]/g, "") === "Caudex" && !CaudexLoaded) {

                                CaudexLoaded = true;

                                document.documentElement.className += " " + CLASS.caudexLoaded;
                            }
                        });
                    });

                } else {

                    document.documentElement.className += " " + CLASS.caudexLoaded;
                }
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS"))));

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

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.Intro = (function () {

        var CLASS = {
                parallaxDestroyed: "intro--no-parallax"
            },

            SELECTOR = {
                self: ".intro",

                background: ".intro__background",
                backgroundLayers: ".intro__background-layer",
                findSquare: ".square"
            },

            $self,

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

                ns.$win.on("technologies__opened." + ns + " technologies__closed." + ns, function (event) {

                    parallax[event.type.match(/opened/) ? "disable" : "enable"]();
                });

                setTimeout(function() {

                    ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSquare]);
                }, 100);
            },

            init = function () {

                $self = $(SELECTOR.self);

                setTimeout(initBackground, 0);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$doc = ns.$doc || $(document);
    ns.$temp = ns.$temp || $([null]);

    ns.JSHover = (function () {

        var CLASS = {
                isHover: "hover"
            },

            SELECTOR = {
                item: "[data-js-hover='true']"
            },

            DATA = {
                preventClick: "js-hover-prevent-click"
            },

            SUPPORTS_PASSIVE = (function() {

                try {

                    window.addEventListener("test", null, { passive: true });

                    return true;

                } catch (e) {}

                return false;
            }()),

            hoverEl,

            byTouch = false,

            onItem = false,

            init = function () {

                var preventClick = null;

                window.document.addEventListener("touchstart", function (event) {

                    ns.$temp[0] = event.target;

                    var $jsHover = ns.$temp.closest(SELECTOR.item),

                        jsHoverEl;

                    if ($jsHover.length) {

                        jsHoverEl = $jsHover[0];

                        byTouch = true;

                        onItem = true;

                        preventClick = null;

                        if (hoverEl !== jsHoverEl) {

                            ns.$temp[0] = jsHoverEl;

                            if (ns.$temp.data(DATA.preventClick)) {

                                preventClick = jsHoverEl;
                            }

                            ns.$temp.addClass(CLASS.isHover);

                            ns.$temp[0] = hoverEl;

                            ns.$temp.removeClass(CLASS.isHover);

                            hoverEl = jsHoverEl;
                        }
                    }

                }, SUPPORTS_PASSIVE ? { passive: true } : false);

                ns.$doc.on("click." + ns, SELECTOR.item, function (event) {

                    if (preventClick === event.currentTarget) {

                        event.preventDefault();
                    }

                    preventClick = null;
                });

                window.document.addEventListener("touchstart", function () {

                    if (!onItem) {

                        if (hoverEl) {

                            ns.$temp[0] = hoverEl;

                            ns.$temp.removeClass(CLASS.isHover);

                            hoverEl = null;
                        }

                        preventClick = null;
                    }

                    onItem = false;

                }, SUPPORTS_PASSIVE ? { passive: true } : false);

                ns.$doc.on("mouseenter." + ns + " mouseleave." + ns, SELECTOR.item, function (event) {

                    if (byTouch) {

                        byTouch = false;

                        return;
                    }

                    var mouseenter = event.type.match(/enter/);

                    ns.$temp[0] = event.currentTarget;

                    ns.$temp[mouseenter ? "addClass" : "removeClass"](CLASS.isHover);

                    hoverEl = mouseenter ? event.currentTarget: null;
                });
            };

        return {
           init: init
        };

    }());
}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$doc = ns.$doc || $(document);
    ns.$temp = ns.$temp || $([null]);

    ns.MainNav = (function () {

        $.easing["mainNav." + ns] = function (x) {
            return 1 - Math.pow(1 - x, 4);
        };

        var CLASS = {
                hidden: "main-nav--hidden",
                stopAnim: "main-nav--stop-anim",
                fixableFixed: "main-nav--fixed",

                activeItem: "main-nav__item--active",

                itemsTopOverflow: "main-nav__items--has-top-overflow",
                itemsBottomOverflow: "main-nav__items--has-bottom-overflow"
            },

            DATA = {
                focus: "main-nav-focus",
                active: "main-nav-active",
                scrollTo: "main-nav-scroll-to",
                ignore: "main-nav-ignore",
                theme: "main-nav-theme"
            },

            SELECTOR = {
                self: ".main-nav",

                itemsWrapper: ".main-nav__items",
                item: ".main-nav__item",
                activeItem: "." + CLASS.activeItem,
                link: ".main-nav__link",

                opener: "#main-nav__mobile-opener",

                fixedElement: ".main-nav",

                localLink: "a[href^='#']:not([href='#']):not([data-" + DATA.ignore + "='true'])",

                scrollTarget: "[data-main-nav-target='true']",

                metaThemeColor: "meta[name='theme-color']"
            },

            EVENT = {
                scrollTo: "main-nav__scroll-to." + ns
            },

            SCROLL_DURATION_BASE = 500,

            AUTOHIDE = 10000,

            initialized = false,

            $scrollingElement,
            lastScrollTop = null,
            clearTransitionTimeout = null,

            scrollDebounce = null,
            showOnOverScroll = false,

            autohideTimeout,
            hideNav = false,

            isFixed = false,

            $self,
            $itemsWrapper,
            $fixedElement,
            $scrollTargets,
            $lastAcitvateItem$link,
            $metaThemeColor,

            $opener,
            onOpenerToggleTimeout,

            skipFindItemToActivate,
            skipFindItemToActivateTimeout,

            preserveHistory,

            currentScrollTarget,

            getFixPosition = function () {

                var styles = window.getComputedStyle($self[0]);

                return $opener.prop("checked") || styles.getPropertyValue("--focus-within") || styles.getPropertyValue("--pointer") ? 0 : 100;
            },

            getScrollOffset = function () {

                return 0;
            },

            updateHistory = function ($link) {

                if (preserveHistory) {

                    return;
                }

                var linkHref = $link[0].getAttribute("href");

                if (history.state !== linkHref) {

                    history.replaceState(linkHref, document.title + " — " + $link.text(), linkHref);
                }
            },

            toggleMobileNav = function (state) {

                $opener.prop("checked", state);
            },

            isMobileNavOpened = function () {

                return $opener.prop("checked");
            },

            getScrollableHeight = function () {

                return document.documentElement.scrollHeight - window.innerHeight;
            },

            isMaxScroll = function () {

                return ns.$win.scrollTop() === getScrollableHeight();
            },

            toggleVisibility = function (state, force) {

                clearTimeout(autohideTimeout);

                if (state || (!state && isMobileNavOpened() && !force)) {

                    autohideTimeout = setTimeout(function() {

                        toggleVisibility(isMobileNavOpened());

                    }, AUTOHIDE);
                }

                $self[state ? "removeClass" : "addClass"](CLASS.hidden);
            },

            toggleFixed = function (state) {

                isFixed = state;

                $self[state ? "addClass" : "removeClass"](CLASS.fixableFixed);
            },

            changeTheme = function ($target) {

                var themeColor = $target.data(DATA.theme);

                if (themeColor) {

                    $metaThemeColor.attr("content", themeColor);
                }
            },

            setScrollableState = function () {

                ns.$temp[0] = this;

                if (this.scrollTop > 0) {

                    ns.$temp.addClass(CLASS.itemsTopOverflow);

                } else {

                    ns.$temp.removeClass(CLASS.itemsTopOverflow);
                }

                if (this.scrollHeight >= this.scrollTop + this.offsetHeight) {

                    ns.$temp.addClass(CLASS.itemsBottomOverflow);

                } else {

                    ns.$temp.removeClass(CLASS.itemsBottomOverflow);
                }
            },

            deactivateItem = function () {

                $self.find(SELECTOR.activeItem)
                    .removeClass(CLASS.activeItem);
            },

            activateItem = function ($link, scroll) {

                if (!$link || ($lastAcitvateItem$link && $lastAcitvateItem$link[0] === $link[0])) {

                    return;
                }

                var $item = $link.closest(SELECTOR.item);

                if ($item.length && $item.closest(SELECTOR.self).length) {

                    deactivateItem();

                    $item.addClass(CLASS.activeItem);

                    $lastAcitvateItem$link = $link;

                    updateHistory($link);
                }

                skipFindItemToActivate = !scroll;
            },

            moveFocus = function ($focusTarget, $link) {

                var focusSelector = $link.attr("data-" + DATA.focus);

                if (focusSelector) {

                    $focusTarget = $(focusSelector);
                }

                if (typeof $focusTarget.attr("tabindex") === "undefined") {

                    $focusTarget.attr("tabindex", -1);
                }

                $focusTarget.focus();
            },

            isLocalLink = function (link) {

                return location.pathname.replace(/^\//, "") === link.pathname.replace(/^\//, "") && location.hostname === link.hostname;
            },

            getScrollTargetTop = function ($link, $target) {

                var scrollTo = parseFloat($link.attr("data-" + DATA.scrollTo) || $target.attr("data-" + DATA.scrollTo));

                return Math.min(
                    Math.max(
                        !isNaN(scrollTo) && isFinite(scrollTo) ?
                            $target.offset().top - (window.innerHeight * (scrollTo / 100)) :
                            $target.offset().top - getScrollOffset(),
                        0
                    ),
                    getScrollableHeight()
                );
            },

            animate = function (scrollTop, scrollDuration, onComplete) {

                var blockHistory = preserveHistory;

                $scrollingElement.animate({ scrollTop: scrollTop }, {

                    duration: scrollDuration,

                    easing: "mainNav." + ns,

                    step: function () {

                        preserveHistory = blockHistory;

                        hideNav = scrollTop > 0;
                    },
                    complete: function () {

                        onComplete();

                        preserveHistory = false;
                    }
                });
            },

            getScrollDuration = function (targetScrollTop) {

                return SCROLL_DURATION_BASE + (SCROLL_DURATION_BASE * Math.abs(ns.$win.scrollTop() - targetScrollTop) / getScrollableHeight());
            },

            scrollToTarget = function (navLink) {

                if (!isLocalLink(navLink)) {

                    return false;
                }

                var targetId = (navLink.href || "").split("#")[1],

                    $link = $(navLink),

                    $scrollTarget = $scrollTargets.filter("#" + targetId);

                if ($scrollTarget.length) {

                    $link.blur();

                    $scrollTarget.attr("id", "");

                    toggleMobileNav(false);

                    var scrollTargetTop = getScrollTargetTop($link, $scrollTarget),

                        activeSelector = $link.attr("data-" + DATA.active) || $scrollTarget.attr("data-" + DATA.active);

                    if (activeSelector) {

                        activateItem($(activeSelector));

                    } else {

                        var linkInsideNav = $link.closest(SELECTOR.self).length;

                        activateItem(
                            linkInsideNav ? $link : $self.find("[href$='#" + targetId + "']")
                        );
                    }

                    animate(
                        scrollTargetTop,
                        getScrollDuration(scrollTargetTop),
                        moveFocus.bind(null, $scrollTarget, $link)
                    );

                    $scrollTarget.attr("id", targetId);

                    changeTheme($scrollTarget);

                    return true;
                }

                return false;
            },

            isTargetInView = function (rect) {

                return rect.top <= window.innerHeight / 4 && rect.bottom > window.innerHeight / 4;
            },

            findCurrentScrollTarget = function () {

                var currentScrollTarget,
                    currentScrollTargetTop = null,

                    rect,
                    target,
                    t = 0;

                for (t; t < $scrollTargets.length; t++) {

                    target = $scrollTargets[t];

                    rect = target.getBoundingClientRect();

                    if (isTargetInView(rect) && (rect.top > currentScrollTargetTop || currentScrollTargetTop === null)) {

                        currentScrollTarget = target;

                        currentScrollTargetTop = rect.top;
                    }
                }

                return currentScrollTarget;
            },

            activateByScroll = function () {

                //nevyhledávat aktivní odkaz, pokud se stránka posouvá kliknutím na odkaz v menu
                if (skipFindItemToActivate) {

                    clearTimeout(skipFindItemToActivateTimeout);

                    skipFindItemToActivateTimeout = setTimeout(function() {

                        skipFindItemToActivate = false;

                    }, 150);

                    return;
                }

                var _currentScrollTarget = findCurrentScrollTarget();

                if (currentScrollTarget !== _currentScrollTarget) {

                    currentScrollTarget = _currentScrollTarget;

                    ns.$temp[0] = currentScrollTarget;

                    var activeSelector = ns.$temp.attr("data-" + DATA.active),

                        $link = activeSelector ? $(activeSelector) : $self.find("[href$='#" + currentScrollTarget.id + "']");

                    activateItem($link, true);

                    updateHistory($link);

                    changeTheme(ns.$temp);
                }
            },

            stopTransitions = function () {

                clearTimeout(clearTransitionTimeout);

                $fixedElement.css("transition", "none");

                clearTransitionTimeout = setTimeout(function() {

                    $fixedElement.css("transition", "");

                }, 0);
            },

            fixNav = function () {

                var scrollTop = ns.$win.scrollTop();

                //skrolování dolu nebo načtení stránky
                if (lastScrollTop < scrollTop || lastScrollTop === null || !initialized) {

                    //IE fix
                    if (lastScrollTop === scrollTop && !(lastScrollTop === null || !initialized)) {

                        return;
                    }

                    //zrušit transition, když se fixuje menu (předtím nebylo fixnuté)
                    if (!isFixed && !isMobileNavOpened()) {

                        stopTransitions();
                    }

                    //skrýt menu pouze při posunu - ne při načtení seskrolované stránky
                    if (lastScrollTop !== null) {

                        if (!isMobileNavOpened()) {

                            toggleVisibility(false);
                        }
                    }

                    if (scrollTop > getFixPosition() && !isFixed) {

                        //odstranit úvodní animaci, pokud se stránka načte jako seskrolovaná
                        if (lastScrollTop === null) {

                            $fixedElement.addClass(CLASS.stopAnim);
                        }

                        toggleFixed(true);
                    }

                } else {

                    //IE fix
                    if (lastScrollTop === scrollTop) {

                        return;
                    }

                    toggleVisibility(!hideNav || isMobileNavOpened());

                    if (scrollTop <= 0) {

                        toggleFixed(false);
                    }

                    hideNav = false;
                }

                lastScrollTop = scrollTop;
            },

            onScroll = function (event) {

                clearTimeout(scrollDebounce);

                //skrolování nahoru
                if ((event.originalEvent.detail || event.originalEvent.deltaY || event.originalEvent.deltaX || -event.originalEvent.wheelDelta) < 0) {

                    showOnOverScroll = false;

                    return;
                }

                if (!showOnOverScroll) {

                    if (isMaxScroll()) {

                        scrollDebounce = setTimeout(function() {

                            showOnOverScroll = true;

                        }, 500);
                    }

                    return;
                }

                if (isMaxScroll()) {

                    toggleVisibility(true);

                    showOnOverScroll = false;
                }
            },

            onMouseoverItemsWrapper = function (event) {

                ns.$temp[0] = event.target;

                var overflows = ns.$temp.hasClass(CLASS.itemsTopOverflow) || ns.$temp.hasClass(CLASS.itemsBottomOverflow);

                this.style.pointerEvents = !overflows && ns.$temp.is([
                    SELECTOR.itemsWrapper, SELECTOR.item
                ].join(",")) ? "none" : "";
            },

            onOpenerToggle = function () {

                clearTimeout(onOpenerToggleTimeout);

                if (this.checked) {

                    onOpenerToggleTimeout = setTimeout(setScrollableState.bind($itemsWrapper[0]), 1000);

                    $itemsWrapper.focus();

                    return;
                }

                $opener.blur();
            },

            scrollToHandler = function (event, target, history) {

                if (typeof target !== "string") {

                    target = "#" + (target.jquery ? target[0].id : target.id);
                }

                if (target.indexOf("#") !== 0) {

                    target = "#" + target;
                }

                preserveHistory = history;

                scrollToTarget($self.find("[href*='" + target + "']")[0]);
            },

            initEvents = function () {

                ns.$doc.on("click." + ns, SELECTOR.localLink, function (event) {

                    if (scrollToTarget(event.currentTarget)) {

                        event.preventDefault();
                    }
                });

                ns.$win.on("scroll." + ns + " scroll.MainNav." + ns + " resize.MainNav." + ns, activateByScroll)
                    .on("scroll." + ns + " scroll.MainNav." + ns, fixNav);

                ns.$win.on("mousewheel." + ns + " DOMMouseScroll." + ns, onScroll);

                $self.on("focusin." + ns, function () {

                    toggleVisibility(true, true);
                });

                $itemsWrapper.on("mouseover." + ns, onMouseoverItemsWrapper)
                    .on("scroll." + ns, setScrollableState);

                $opener.on("change." + ns, onOpenerToggle);

                ns.$win.on(EVENT.scrollTo, scrollToHandler);

                ns.$win.trigger("scroll.MainNav." + ns);
            },

            initElements = function () {

                $scrollingElement = $("html, body");

                $self = $(SELECTOR.self);

                $itemsWrapper = $self.find(SELECTOR.itemsWrapper);

                $fixedElement = $(SELECTOR.fixedElement);

                $opener = $self.find(SELECTOR.opener);

                $scrollTargets = $(SELECTOR.scrollTarget);

                $metaThemeColor = $(SELECTOR.metaThemeColor);
            },

            init = function () {

                if (window.location.hash) {

                    preserveHistory = true;
                }

                initElements();

                initEvents();

                initialized = true;

                preserveHistory = false;
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.Offer = (function () {

        var CLASS = {
                initFadeIn: "offer--init-fade-in",
                technologiesInView: "offer--technologies-in-view",
                parallaxDestroyed: "offer--no-parallax"
            },

            SELECTOR = {
                self: ".offer",
                technology: ".offer__technology",

                background: ".offer__background",
                backgroundLayers: ".offer__background-layer",
                findSquare: ".square"
            },

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

                setTimeout(function() {

                    ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSquare]);
                }, 100);
            },

            initInteractionAnimation = function () {

                var scrollDebounce = null,
                    scrollTimeout = null,

                    $firstTechnology = null;

                ns.$win.on("scroll.Offer." + ns, function () {

                    clearTimeout(scrollDebounce);
                    clearTimeout(scrollTimeout);

                    scrollDebounce = setTimeout(function() {

                        $firstTechnology = $firstTechnology || $self.find(SELECTOR.technology).first();

                        var firstTechnologyRect = $firstTechnology[0].getBoundingClientRect(),
                            winHeight = window.innerHeight;

                        if (firstTechnologyRect.top <= winHeight * (2 / 3) && $self[0].getBoundingClientRect().bottom > winHeight * (1 / 3)) {

                            $self.addClass(CLASS.technologiesInView);

                            ns.$win.off("scroll.Offer." + ns);
                        }
                    }, 100);
                });

                scrollTimeout = setTimeout(function() {

                    ns.$win.trigger("scroll.Offer." + ns);

                }, 300);

                ns.$win.on("technologies__interaction." + ns, function () {

                    clearTimeout(scrollDebounce);
                    clearTimeout(scrollTimeout);

                    ns.$win.off("scroll.Offer." + ns);
                });
            },

            init = function () {

                $self = $(SELECTOR.self);

                checkScrollTop();

                //ie fix
                setTimeout(checkScrollTop, 50);

                setTimeout(initBackground, 0);
                setTimeout(initInteractionAnimation, 0);
            };

        return {
            init: init,

            find: function (selector) {

                return $self.find(selector);
            },

            getSelf: function () {

                return $self;
            }
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.Performance = (function () {

        var CLASS = {
                low: "performance--low",
                veryLow: "performance--very-low"
            },

            TRASHHOLD = 40,
            TRASHHOLD2 = 25,

            fps = [60, 60, 60, 60, 60],
            fpsCounter = 0,

            lastTime,
            currentFps = 60,
            lastState = 0,

            checkPerformance = function () {

                var f = fps.length - 1,

                    total = 0;

                for (f; f >= 0; f--) {

                    total += fps[f];
                }

                currentFps = total / fps.length;

                if (currentFps < TRASHHOLD && lastState === 0) {

                    ns.$win.trigger("lowperformance." + ns, [currentFps]);

                    document.body.className += " " + CLASS.low;

                    lastState++;
                }

                if (currentFps < TRASHHOLD2 && lastState === 1) {

                    ns.$win.trigger("verylowperformance." + ns, [currentFps]);

                    document.body.className += " " + CLASS.veryLow;

                    lastState++;
                }
            },

            test = function (time) {

                fpsCounter++;

                if (time - lastTime >= 1000) {

                    checkPerformance();

                    if (lastState === 2) {

                        return;
                    }

                    fps.unshift();
                    fps.push(fpsCounter);

                    fpsCounter = 0;

                    lastTime = time;
                }

                requestAnimationFrame(test);
            },

            init = function () {

                lastTime = window.performance ? window.performance.now() : Date.now();

                requestAnimationFrame(test);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

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

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax, Infinitum*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.References = (function () {

        var CLASS = {
                parallaxDestroyed: "references--no-parallax",

                selfJSLoaded: "references--js-loaded",

                activeTab: "references__reference--active",
                imageLoaded: "references__reference--image-loaded",
                imageLoading: "references__reference--image-loading",

                fadeIn: "fade-in"
            },

            SELECTOR = {
                self: ".references",

                nav: ".references__nav",
                navLink: ".references__nav-link",

                tabs: ".references__references",
                tab: ".references__reference",
                activeTab: "." + CLASS.activeTab,

                imageWrapper: ".references__image-wrapper",
                imageTemplate: ".references__image-template",
                infoItem: ".references__project-info-item",
                infoContent: ".references__project-info-content",
                moreInfo: ".references__project-more-info",

                background: ".references__background",
                backgroundLayers: ".references__background-layer",
                findSquare: ".square"
            },

            TAB_SWITCH_QUEUE = "tab." + ns,

            STAGGER_DELAY = 30,
            TAB_SWITCH_DELAY = 300,

            $self,
            $tabsWrapper,
            $activeTab,

            $bgLayers,
            parallax,

            infinitum,

            correctWrapperHeight = function () {

                $tabsWrapper.css("height", $activeTab.outerHeight(true));
            },

            getNextTabHeight = function ($tabToShow) {

                $tabToShow.show().css("position", "relative");

                var toHeight = $tabsWrapper.css("height", "auto").outerHeight();

                correctWrapperHeight();

                $tabToShow.css("position", "");

                return toHeight;
            },

            buildSwitchAnimation = function ($tabToShow, $queueEl) {

                var $currentTab = $activeTab,

                    isIndex = $currentTab.index(),
                    willIndex = $tabToShow.index(),

                    currentHeight = $tabsWrapper.outerHeight(),
                    toHeight = getNextTabHeight($tabToShow),

                    currentIsSmaller = toHeight - currentHeight > 0,

                    hideDelay = 0;

                if (currentIsSmaller) {

                    $tabsWrapper.height(toHeight);
                }

                $queueEl.queue(TAB_SWITCH_QUEUE + isIndex, function (next) {

                    $currentTab.find(SELECTOR.imageWrapper)
                        .removeClass(CLASS.fadeIn);

                    $currentTab.find(SELECTOR.moreInfo)
                        .removeClass(CLASS.fadeIn);

                    next();
                });

                $($currentTab.find(SELECTOR.infoItem).get().reverse()).each(function (i) {

                    var _this = this;

                    hideDelay += STAGGER_DELAY * (i + 1);

                    $queueEl.delay(STAGGER_DELAY * (i + 1), TAB_SWITCH_QUEUE + isIndex);

                    $queueEl.queue(TAB_SWITCH_QUEUE + isIndex, function (next) {

                        ns.$temp[0] = _this;

                        ns.$temp.removeClass(CLASS.fadeIn)
                            .next()
                            .removeClass(CLASS.fadeIn);

                        next();
                    });
                });

                $queueEl.delay(TAB_SWITCH_DELAY + hideDelay, TAB_SWITCH_QUEUE + willIndex);

                $queueEl.queue(TAB_SWITCH_QUEUE + willIndex, function (next) {

                    if (!currentIsSmaller) {

                        $tabsWrapper.height(toHeight);
                    }

                    $tabToShow.find(SELECTOR.imageWrapper)
                        .addClass(CLASS.fadeIn);

                    next();
                });

                $tabToShow.find(SELECTOR.infoItem).each(function (i) {

                    var _this = this;

                    $queueEl.queue(TAB_SWITCH_QUEUE + willIndex, function (next) {

                        ns.$temp[0] = _this;

                        ns.$temp.addClass(CLASS.fadeIn)
                            .next()
                            .addClass(CLASS.fadeIn);

                        next();
                    });

                    $queueEl.delay(STAGGER_DELAY * (i + 1), TAB_SWITCH_QUEUE + willIndex);
                });

                $queueEl.queue(TAB_SWITCH_QUEUE + willIndex, function () {

                    $tabToShow.find(SELECTOR.moreInfo)
                        .addClass(CLASS.fadeIn);

                    if ($currentTab[0] !== $activeTab[0]) {

                        $currentTab.hide();
                    }
                });
            },

            loadImage = function ($tabToShow) {

                if ($tabToShow.hasClass(CLASS.imageLoaded) || $tabToShow.hasClass(CLASS.imageLoading)) {

                    return;
                }

                var $template = $tabToShow.find(SELECTOR.imageTemplate),
                    $image = $($template.text());

                $image.one("load." + ns, function () {

                    $tabToShow.addClass(CLASS.imageLoaded)
                        .removeClass(CLASS.imageLoading);
                });

                $tabToShow.addClass(CLASS.imageLoading);

                $template.replaceWith($image);
            },

            switchTabs = function (event) {

                ns.$temp[0] = event.target;

                var href = ns.$temp.find(SELECTOR.navLink)[0].href,
                    isIndex = $activeTab.index(),
                    willIndex = ns.$temp.index(),

                    $tabToShow = $self.find(SELECTOR.tab).eq(willIndex),

                    $queueEl = $self.stop(TAB_SWITCH_QUEUE + willIndex, true, false);

                $activeTab.removeClass(CLASS.activeTab);

                loadImage($tabToShow);

                buildSwitchAnimation($tabToShow, $queueEl);

                $activeTab = $tabToShow.addClass(CLASS.activeTab);

                window.history.replaceState(href, "", href);

                $queueEl.dequeue(TAB_SWITCH_QUEUE + isIndex)
                    .dequeue(TAB_SWITCH_QUEUE + willIndex);
            },

            initNav = function () {

                infinitum = new Infinitum({
                    selector: SELECTOR.nav,
                    startBreak: Infinitum.POSITION[window.innerWidth < 1400 ? "START" : "CENTER"],
                    watchContainer: 100,
                    watchItems: 200
                });

                var changeDebounce = null,

                    tapped = false;

                infinitum.on("tap." + ns + " dragging." + ns, function () {

                    tapped = true;
                });

                infinitum.on("change." + ns, function (event) {

                    clearTimeout(changeDebounce);

                    changeDebounce = setTimeout(switchTabs.bind(this, event), tapped ? 0 : 300);

                    tapped = false;
                });

                if (window.location.hash) {

                    var $activeLink = infinitum.$items.find("[href*='" + window.location.hash + "']");

                    if ($activeLink.length) {

                        infinitum.setCurrent($activeLink.parent());

                        ns.$win.trigger("main-nav__scroll-to." + ns, $self, true);
                    }
                }
            },

            initTabs = function () {

                $tabsWrapper = $self.find(".references__references");

                var $tabs = $tabsWrapper.find(SELECTOR.tab);

                $tabs.hide();

                $activeTab = $tabs.filter(SELECTOR.activeTab);

                $activeTab.show();

                correctWrapperHeight();

                ns.$win.on("resize." + ns + " resize.References." + ns, correctWrapperHeight);

                //iOS fix (špatná výška)
                setTimeout(function() {

                    ns.$win.trigger("resize.References." + ns);

                }, 200);
            },

            initBackground = function () {

                $bgLayers = $self.find(SELECTOR.backgroundLayers);

                parallax = new Parallax({
                    parallax: SELECTOR.background,
                    layers: $bgLayers,
                    fakeTilt: false,
                    debounce: 100,

                    onBeforeTransform: function ($el, progress, tX, tY, transform) {

                        var layer = this.layers[0].$el === $el ? this.layers[0] : this.layers[1],

                            extention = layer.parallaxYExtention;

                        transform.x += extention * progress;
                    }
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

                $self.addClass(CLASS.selfJSLoaded);

                initNav();

                initTabs();

                setTimeout(initBackground, 100);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.SmallCaps = (function () {

        var ATTR = {
                item: "data-small-caps"
            },

            SELECTOR = {
                items: "[" + ATTR.item + "='true']"
            },

            getAttr = function (state) {

                return ATTR.item + ( typeof state === "boolean" ? "=\"" + state.toString() + "\"" : "");
            },

            removeItem = function ($el) {

                return $el[0].removeAttribute(ATTR.item);
            },

            isItem = function ($el) {

                return !!$el[0].getAttribute(ATTR.item);
            },

            init = function () {

                if (typeof $.fn.smallCaps === "function") {

                    var items = document.querySelectorAll(SELECTOR.items);

                    $(items).smallCaps();
                }
            };

        return {
            init: init,

            isItem: isItem,
            removeItem: removeItem,

            getAttr: getAttr
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Infinitum, CodeMirror*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.Technologies = (function () {

        var CLASS = {
                activeTechnology: "technologies__technology--active",
                fromLeftTechnology: "technologies__technology--from-left",
                fromRightTechnology: "technologies__technology--from-right",
                showCodeSample: "technologies--show-sample",

                toggle: "ui__content--technologies"
            },

            DATA = {
                tab: "technologies-tab",
                mimeMode: "codemirror-mimemode"
            },

            SELECTOR = {
                self: ".technologies",
                toggleEl: "body",

                nav: ".technologies__nav",
                navLink: ".technologies__nav-link",

                activeIndicator: ".technologies__nav-active-indicator",
                findActiveIndicatorSizeEl: ".text",

                tab: ".technologies__technology",
                textWrapper: ".technologies__text-content-wrapper",
                sampleWrapper: ".technologies__sample-content-wrapper",
                sampleContent: ".technologies__sample-content",
                findSampleContentCode: "code",
                contentWrappers: ".technologies__text-content-wrapper, .technologies__sample-content-wrapper",

                openers: "[data-" + DATA.tab + "]",
                closeBtn: ".technologies__close",
                sampleBtns: ".technologies__show-sample",

                inertEl: ".main-nav, .ui__perspective",

                metaThemeColor: "meta[name='theme-color']",

                pagePerspective: ".ui__perspective"
            },

            EVENT = {
                opened: "technologies__opened." + ns,
                closed: "technologies__closed." + ns,
                interaction: "technologies__interaction." + ns
            },

            SCROLL_OPTIONS = {
                theme: "minimal",
                scrollInertia: 500,
                mouseWheel:{
                    scrollAmount: 162,
                    deltaFactor: 27
                }
            },

            SCROLL_AMOUNT_SAMPLE = 324,

            THEME_COLOR = "#ceb77e",

            initialized,

            $self,
            $perspective,
            $nav,
            $navLinks,
            $activeIndicator,
            $tabs,
            $contentWrappers,
            $closeBtn,
            $sampleBtns,
            $openers,
            openedByEl,

            $toggleEl,
            $inertEl,

            infinitum,

            activeIndicatorHasWidth,

            openTimeout,
            switchTabsTimeout,
            highlightCodeTimeout,

            highlighted = [],

            $metaThemeColor,
            savedThemeColor,

            fixCodeMirrorCSS = function () {

                var mode = CodeMirror.mimeModes["text/css"],

                    valueKeywords = Object.keys(mode.valueKeywords),

                    addValueKeywords = [
                        "line-height", "width", "cubic-bezier"
                    ];

                addValueKeywords.forEach(function (keyword) {

                    if (valueKeywords.indexOf(keyword) === -1) {

                        mode.valueKeywords[keyword] = true;
                    }
                });
            },

            cancelPreventScroll = function () {

                ns.$win.off(["mousewheel", "DOMMouseScroll", "touchmove"].join(".Technologies." + ns + " "));
            },

            preventScroll = function () {

                ns.$win.on(["mousewheel", "DOMMouseScroll", "touchmove"].join(".Technologies." + ns + " "), function (event) {

                    ns.$temp[0] = event.target;

                    if (event.type === "touchmove" && ns.$temp.closest(SELECTOR.contentWrappers).length) {

                        return;
                    }

                    event.preventDefault();
                });
            },

            setPagePerspective = function () {

                $perspective = $perspective || $(SELECTOR.pagePerspective);

                var windowCenter = ns.$win.scrollTop() + (window.innerHeight / 2);

                $perspective.css("perspective-origin", "50% " + windowCenter + "px");
            },

            close = function (event) {

                cancelPreventScroll();

                ns.$win.off("keyup.Technologies" + ns);

                $inertEl.prop("inert", false);
                $self.prop("inert", true);

                openedByEl.focus();

                setPagePerspective();

                $metaThemeColor.attr("content", savedThemeColor);

                var hash = "#" + ns.Offer.getSelf()[0].id;

                window.history.replaceState(hash, "", hash);

                $toggleEl.removeClass(CLASS.toggle);
                $self.removeClass(CLASS.showCodeSample);

                ns.$win.trigger(EVENT.closed);

                event.preventDefault();

                $self.on("transitionend." + ns, function (event) {

                    if (event.originalEvent.propertyName === "visibility" && event.originalEvent.target === $self[0]) {

                        $self.off("transitionend." + ns)
                            .css("display", "none");
                    }
                });
            },

            listenESC = function () {

                ns.$win.on("keyup.Technologies" + ns, function (event) {

                    if (event.which === 27) {

                        close(event);
                    }
                });
            },

            getTabIndexFrom$El = function ($el) {

                return parseInt($el.data(DATA.tab), 10) || 0;
            },

            resetSamplesScrollPosition = function () {

                if ($contentWrappers) {

                    $contentWrappers.filter(SELECTOR.sampleWrapper)
                        .mCustomScrollbar("scrollTo", [0, 0], {
                            scrollInertia: 0
                        });
                }
            },

            open = function (event) {

                $self.off("transitionend." + ns)
                    .css("display", "block");

                if (!initialized) {

                    initSelf($openers.get().indexOf(this));
                }

                setPagePerspective();

                openedByEl = this;

                clearTimeout(openTimeout);

                preventScroll();

                listenESC();

                ns.$temp[0] = this;

                $navLinks.css("transition", "none");
                $contentWrappers.css("transition", "none");

                resetSamplesScrollPosition();

                $tabs.removeClass(CLASS.fromRightTechnology)
                    .removeClass(CLASS.fromLeftTechnology)
                    .removeClass(CLASS.activeTechnology);

                $self.find(Infinitum.CLASS.selector("current"))
                    .removeClass(Infinitum.CLASS.current);

                $inertEl.prop("inert", true);
                $self.prop("inert", false);

                infinitum.refresh({
                    current: getTabIndexFrom$El(ns.$temp)
                }, true);

                savedThemeColor = $metaThemeColor.attr("content");

                openTimeout = setTimeout(function() {

                    $toggleEl.addClass(CLASS.toggle);

                    $navLinks.css("transition", "");
                    $contentWrappers.css("transition", "");

                    $nav.focus();

                    $metaThemeColor.attr("content", THEME_COLOR);

                    ns.$win.trigger(EVENT.opened);

                }, 0);

                event.preventDefault();
            },

            setIndicatorWidth = function (event) {

                switch (event.type) {

                    case "dragging":

                        if (activeIndicatorHasWidth) {

                            $activeIndicator.width(0);

                            activeIndicatorHasWidth = false;
                        }

                        break;

                    case "init":

                        $activeIndicator.width(infinitum.$currentItem.find(SELECTOR.findActiveIndicatorSizeEl).width());

                        activeIndicatorHasWidth = true;

                        break;

                    default:

                        ns.$temp[0] = event.type === "change" ? event.target : infinitum.$currentItem[0];

                        $activeIndicator.width(ns.$temp.find(SELECTOR.findActiveIndicatorSizeEl).width());

                        activeIndicatorHasWidth = true;
                }
            },

            isTabHighlighted = function (tab) {

                return !($tabs.eq(tab).length && highlighted.indexOf(tab) === -1);
            },

            highlightCode = function (tab, all) {

                tab = !tab || tab < 0 ? 0 : tab;

                if (!isTabHighlighted(tab)) {

                    var $pre = $tabs.eq(tab).find(SELECTOR.sampleContent),
                        $code = $pre.find(SELECTOR.findSampleContentCode);

                    CodeMirror.runMode($code.text(), $pre.data(DATA.mimeMode), $code[0]);

                    highlighted.push(tab);

                    if (all) {

                        var nextTab = (tab + 1) % $tabs.length;

                        if (!isTabHighlighted(nextTab)) {

                            clearTimeout(highlightCodeTimeout);

                            highlightCodeTimeout = setTimeout(highlightCode.bind(null, nextTab, true), 1000);
                        }
                    }
                }
            },

            switchTabs = function (event) {

                clearTimeout(switchTabsTimeout);

                ns.$temp[0] = event.fromElement;

                var prevIndex = ns.$temp.index();

                ns.$temp[0] = event.target;

                var currentIndex = ns.$temp.index();

                $contentWrappers.css("transition", "none");

                $tabs.filter(function (index) { return index === prevIndex || index === currentIndex; })
                    .removeClass(CLASS.fromRightTechnology)
                    .removeClass(CLASS.fromLeftTechnology);

                $tabs.eq(prevIndex)
                    .addClass(
                        infinitum._lastDir === Infinitum.DIR.LEFT ? CLASS.fromLeftTechnology : CLASS.fromRightTechnology
                    );

                $tabs.eq(currentIndex)
                    .addClass(
                        infinitum._lastDir === Infinitum.DIR.LEFT ? CLASS.fromRightTechnology : CLASS.fromLeftTechnology
                    );

                highlightCode(currentIndex);

                var $link = ns.$temp.find(SELECTOR.navLink);

                switchTabsTimeout = setTimeout(function() {

                    $tabs.removeClass(CLASS.activeTechnology)
                        .eq(currentIndex)
                        .addClass(CLASS.activeTechnology);

                    $contentWrappers.css("transition", "");

                    window.history.replaceState($link[0].href, "", $link[0].href);

                }, 0);
            },

            initNav = function () {

                $nav = $self.find(SELECTOR.nav);

                $navLinks = $nav.find(SELECTOR.navLink);

                $activeIndicator = $nav.find(SELECTOR.activeIndicator);

                infinitum = new Infinitum({
                    el: $nav,
                    startBreak: Infinitum.POSITION.START,
                    watchContainer: 100
                });

                window.nav = infinitum;

                setIndicatorWidth({ type: "init" });

                infinitum.on("change." + ns, switchTabs);

                infinitum.on("change." + ns + " dragging." + ns + " dragend." + ns, setIndicatorWidth);

                ns.$win.on("resize." + ns, setIndicatorWidth);

                setTimeout(setIndicatorWidth.bind(null, { type: "ios-fix" }), 100);
            },

            initButtons = function () {

                $closeBtn = $self.find(SELECTOR.closeBtn)
                    .on("click." + ns, close);

                $sampleBtns = $self.find(SELECTOR.sampleBtns)
                    .on("click." + ns, function (event) {

                        $self.toggleClass(CLASS.showCodeSample);

                        event.preventDefault();
                    });
            },

            initContent = function (tab) {

                $tabs = $self.find(SELECTOR.tab);
                $contentWrappers = $tabs.find(SELECTOR.contentWrappers);

                if (typeof document.body.style.webkitOverflowScrolling === "undefined" && !document.documentElement.className.match(/android/)) {

                    SCROLL_OPTIONS.axis = "y";

                    $contentWrappers.filter(SELECTOR.textWrapper).mCustomScrollbar(SCROLL_OPTIONS);

                    SCROLL_OPTIONS.axis = "yx";
                    SCROLL_OPTIONS.mouseWheel.scrollAmount = SCROLL_AMOUNT_SAMPLE;

                    $contentWrappers.filter(SELECTOR.sampleWrapper).mCustomScrollbar(SCROLL_OPTIONS);
                }

                fixCodeMirrorCSS();

                highlightCode(tab, true);
            },

            initSelf = function (tab) {

                $inertEl = $(SELECTOR.inertEl);

                $toggleEl = $(SELECTOR.toggleEl);

                $metaThemeColor = $(SELECTOR.metaThemeColor);

                initNav();

                initButtons();

                initContent(tab);

                initialized = true;
            },

            init = function () {

                $openers = $(SELECTOR.openers).on("click." + ns, open);

                $openers.one("mouseenter." + ns + " touchstart." + ns, function () {

                    if (!initialized) {

                        $self.css("display", "block");

                        initSelf($openers.get().indexOf(this));

                        $self.css("display", "none");

                        ns.$win.trigger(EVENT.interaction);
                    }
                });

                $self = $(SELECTOR.self);

                $self.prop("inert", true);

                if (window.location.hash) {

                    ns.Offer.find("[href*='" + window.location.hash + "']").click();
                }
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
