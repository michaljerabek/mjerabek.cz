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

                fpsCounter = document.hidden ? 60: fpsCounter + 1;

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

/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);

    ns.Visibility = (function () {

        var CLASS = {
                wasVisible: "was-visible"
            },

            markAsWasVisible = function () {

                if (!document.hidden) {

                    ns.$temp[0] = document.documentElement;

                    ns.$temp.addClass(CLASS.wasVisible);

                    document.removeEventListener("visibilitychange", markAsWasVisible);
                }
            },

            init = function () {

                if (document.visibilityState) {

                    if (!document.hidden) {

                        markAsWasVisible();

                        return;
                    }

                    document.addEventListener("visibilitychange", markAsWasVisible);
                }
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
                items: "[data-break-text='true']",
                lazyItems: "[data-break-text='lazy']"
            },

            wrapLetter = function (letter, num, smallCaps) {

                var attrs = [
                        "class=\"", CLASS.letter + num, "\" style=\"display: inline-block;\"",
                        smallCaps ? ns.SmallCaps.getAttr(smallCaps) : ""
                    ].join(" ");

                return "<span " + attrs + ">" + letter + "</span>";
            },

            getWhiteSpace = function (num) {

                return "<span class=\"" + (CLASS.space + num) + "\"> </span>";
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

                var smallCapsAttr = ns.SmallCaps.getState(ns.$temp),

                    result = breakText(ns.$temp, smallCapsAttr);

                if (smallCapsAttr) {

                    ns.SmallCaps.removeItem(ns.$temp);
                }

                ns.$temp.html(result.join(""));
            },

            execInit = function (selector) {

                var items = document.querySelectorAll(selector),

                    length = items.length,
                    i = 0;

                for (i; i < length; i++) {

                    processElement(i, items[i]);
                }
            },

            init = function () {

                execInit(SELECTOR.items);

                if (window.requestIdleCallback) {

                    window.requestIdleCallback(execInit.bind(this, SELECTOR.lazyItems));

                } else {

                    setTimeout(execInit.bind(this, SELECTOR.lazyItems), 0);
                }
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

                        ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSquare]);

                    }, 100);
                });
            },

            init = function () {

                $self = $(SELECTOR.self);

                ns.$ParallaxLoader.then(initBackground);
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
                items: "[" + ATTR.item + "='true']",
                lazyItems: "[" + ATTR.item + "='lazy']"
            },

            getAttr = function (state) {

                return ATTR.item + (state ? "=\"" + state.toString() + "\"" : "");
            },

            removeItem = function ($el) {

                return $el[0].removeAttribute(ATTR.item);
            },

            getState = function ($el) {

                var attr = $el[0].getAttribute(ATTR.item);

                return attr === "true" ? true: attr === "lazy" ? "lazy" : false;
            },

            execInit = function (selector) {

                var $items = $(document.querySelectorAll(selector));

                $items.smallCaps();
            },

            init = function () {

                if (typeof $.fn.smallCaps === "function") {

                    execInit(SELECTOR.items);

                    if (window.requestIdleCallback) {

                        window.requestIdleCallback(execInit.bind(this, SELECTOR.lazyItems));

                    } else {

                        setTimeout(execInit.bind(this, SELECTOR.lazyItems), 0);
                    }
                }
            };

        return {
            init: init,

            getState: getState,
            removeItem: removeItem,

            getAttr: getAttr
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
                scrollTo: "main-nav__scroll-to." + ns,

                targetChanged: "main-nav__target-changed." + ns
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

                if ($link === null) {

                    history.replaceState(null, document.title, "#");

                    ns.$win.trigger(EVENT.targetChanged, [null]);

                    return;
                }

                var linkHref = $link[0].getAttribute("href");

                if (history.state !== linkHref) {

                    history.replaceState(linkHref, document.title + " — " + $link.text(), linkHref);

                    ns.$win.trigger(EVENT.targetChanged, [linkHref.split("#")[1]]);
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

                return link && location.pathname.replace(/^\//, "") === link.pathname.replace(/^\//, "") && location.hostname === link.hostname;
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

                $scrollingElement
                    .stop()
                    .animate({ scrollTop: scrollTop }, {

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

                    if (!_currentScrollTarget) {

                        deactivateItem();

                        updateHistory(null);

                        return;
                    }

                    ns.$temp[0] = currentScrollTarget;

                    var activeSelector = ns.$temp.attr("data-" + DATA.active),

                        $link = activeSelector ? $(activeSelector) : $self.find("[href$='#" + currentScrollTarget.id + "']");

                    activateItem($link, true);

                    updateHistory($link);

                    if (!initialized) {

                        ns.$win.trigger(EVENT.targetChanged, [$link[0].href.split("#")[1]]);
                    }

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
                $metaThemeColor = $(SELECTOR.metaThemeColor);

                $self = $(SELECTOR.self);
                $itemsWrapper = $self.find(SELECTOR.itemsWrapper);

                $fixedElement = $(SELECTOR.fixedElement);
                $scrollTargets = $(SELECTOR.scrollTarget);
                $opener = $self.find(SELECTOR.opener);
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

        $.easing[ns + ".Offer__light-on"] = function (x) {
            return x * x * x;
        };

        $.easing[ns + ".Offer__light-off"] = function (x) {
            return Math.sqrt(1 - Math.pow(x - 1, 2));
        };

        var CLASS = {
                initFadeIn: "offer--init-fade-in",
                parallaxDestroyed: "offer--no-parallax",

                lightOn: "offer--light-on",

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
                self: ".offer",
                findCenter: ".layout__center",
                findBtn: ".btn",

                background: ".offer__background",
                backgroundLayers: ".offer__background-layer",
                findSquare: ".square",

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

            getFeaturesAnimIndex = function (lastIndex, count) {

                var index = Math.ceil(Math.random() * count) - 1;

                return index === lastIndex ? getFeaturesAnimIndex(lastIndex, count) : index;
            },

            initLigth = function ($toggleIcon) {

                var $light, $btn, centerEl;

                $toggleIcon.on("click." + ns, function (event) {

                    event.preventDefault();

                    $light = $light || $self.find(SELECTOR.light);
                    $btn = $btn || $self.find(SELECTOR.findBtn);
                    centerEl = centerEl || $self.find(SELECTOR.findCenter)[0];

                    var iconPosition = $toggleIcon.position(),

                        iconCenter = [
                            centerEl.offsetLeft + iconPosition.left + ($toggleIcon.outerWidth() / 2),
                            centerEl.offsetTop + iconPosition.top + ($toggleIcon.outerHeight() / 2)
                        ],

                        isLightOn = $self.hasClass(CLASS.lightOn);

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

                            $self.removeClass(CLASS.lightOn);

                            $btn.removeClass(CLASS.btnDark)
                                .addClass(CLASS.btnLight);

                        } else {

                            $self.addClass(CLASS.lightOn);

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

                var $featureIcon = $self.find(SELECTOR.featureIcon),
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

                setInterval(function animateIconInterval() {

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

                }, FEATURE_ICON_ANIM_INTERVAL);

                initLigth($featureIcon.filter(SELECTOR.featureIconManual));
                initGears($featureIcon.filter(SELECTOR.featureIconSystem));
                initGlass($featureIcon.filter(SELECTOR.featureIconOptimization));
            },

            isIE10Or11 = function () {

                return parseInt($self.css("text-indent")) === 1;
            },

            init = function () {

                $self = $(SELECTOR.self);

                checkScrollTop();

                //ie fix
                setTimeout(checkScrollTop, 50);

                ns.$ParallaxLoader.then(initBackground);

                if (!isIE10Or11()) {

                    setTimeout(initFeaturesAnim, 0);
                }
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
    ns.$temp = ns.$temp || $([null]);

    ns.TechnologiesLoader = (function () {

        var CLASS = {
                loading: "technologies--loading",
                showLoader: "technologies--show-loader",
                loaded: "technologies--loaded",
                error: "technologies--error",

                btnProgress: "btn--progress",
                btnError: "btn--error",

                js: "technologies-loader__js",
                css: "technologies-loader__css",
                font: "technologies-loader__font"
            },

            DATA = {
                tab: "technologies-tab"
            },

            SELECTOR = {
                technologiesLoader: ".technologies-loader",
                technologies: ".technologies",

                openers: "[data-" + DATA.tab + "]",
                btn: ".btn"
            },

            STATE = {
                ERROR: -1,
                INIT: 1,
                LOADING: 10,
                LOADED: 20
            },

            TECHNOLOGIES_HASH_REGEX = /^#(html|css|js)$/i,
            SECTION_TARGETS_REGEX = /^co-delam$/i,

            SECTION_TARGETS_LOAD_DELAY = 3000,

            JS_TO_LOAD = ns.ENV.match(/^prod/i) ? "build/technologies.build.min.js" : "build/technologies.build.js",
            CSS_TO_LOAD = ns.ENV.match(/^prod/i) ? "build/technologies.build.min.css" : "build/technologies.build.css",
            FONT_TO_LOAD = "https://fonts.googleapis.com/css?family=PT+Mono&display=swap",

            currentState = STATE.INIT,

            loadIdleCallback,

            $technologiesLoader,
            $technologies,
            $openers,

            elOpener,
            initTab,

            sectionTargetsLoadDebounce,

            shouldBeLoadedByHash = function () {

                return currentState <= STATE.INIT && window.location.hash && window.location.hash.match(TECHNOLOGIES_HASH_REGEX);
            },

            onError = function (event) {

                currentState = STATE.ERROR;

                event.target.parentElement.removeChild(event.target);

                $technologies.addClass(CLASS.error)
                    .removeClass(CLASS.showLoader);

                if (!elOpener) {

                    return;
                }

                ns.$temp[0] = elOpener;

                if (ns.$temp.is(SELECTOR.btn)) {

                    ns.$temp.removeClass(CLASS.btnProgress)
                        .addClass(CLASS.btnError);
                }

                elOpener = null;
            },

            onLoad = function (event) {

                switch (event.target.className) {

                    case CLASS.css:

                        CSS_TO_LOAD = null;

                        break;

                    case CLASS.js:

                        JS_TO_LOAD = null;

                        break;
                }

                if (!CSS_TO_LOAD && !JS_TO_LOAD) {

                    currentState = STATE.LOADED;

                    if ($openers) {

                        $openers.removeClass(CLASS.btnProgress)
                            .removeClass(CLASS.btnError)
                            .off(".TechnologiesLoader." + ns);
                    }

                    ns.$win.off(".TechnologiesLoader." + ns)
                        .off("main-nav__target-changed.TechnologiesLoader." + ns);

                    $technologiesLoader.off("." + ns);

                    $technologies.removeClass(CLASS.loading)
                        .removeClass(CLASS.showLoader)
                        .addClass(CLASS.loaded);

                    if (elOpener) {

                        ns.$temp[0] = elOpener;

                        initTab = ns.$temp.data(DATA.tab);
                    }

                    ns.Technologies.init(initTab);

                    if (elOpener) {

                        elOpener.click();
                    }
                }
            },

            load = function () {

                if (loadIdleCallback && window.cancelIdleCallback) {

                    window.cancelIdleCallback(loadIdleCallback);
                }

                if (currentState > STATE.INIT || (!JS_TO_LOAD && !CSS_TO_LOAD)) {

                    return;
                }

                currentState = STATE.LOADING;

                $technologies.removeClass(CLASS.error)
                    .addClass(CLASS.loading);

                var elScript = JS_TO_LOAD ? document.createElement("script") : null,
                    elStyleLink = CSS_TO_LOAD ? document.createElement("link") : null,
                    elFontLink = FONT_TO_LOAD ? document.createElement("link") : null;

                if (elScript) {

                    elScript.className = CLASS.js;
                    elScript.defer = true;
                    elScript.src = JS_TO_LOAD;
                    elScript.onload = onLoad;
                    elScript.onerror = onError;

                    document.head.appendChild(elScript);
                }

                if (elStyleLink) {

                    elStyleLink.className = CLASS.css;
                    elStyleLink.rel = "stylesheet";
                    elStyleLink.media = "screen";
                    elStyleLink.href = CSS_TO_LOAD;
                    elStyleLink.onload = onLoad;
                    elStyleLink.onerror = onError;

                    document.head.appendChild(elStyleLink);
                }

                if (elFontLink) {

                    elFontLink.className = CLASS.font;
                    elFontLink.rel = "stylesheet";
                    elFontLink.href = FONT_TO_LOAD;

                    document.head.appendChild(elFontLink);

                    FONT_TO_LOAD = null;
                }
            },

            cancelLoader = function () {

                if (!elOpener) {

                    var currentScrollTop = ns.$win.scrollTop();

                    window.location.hash = "";

                    ns.$win.scrollTop(currentScrollTop);
                }

                elOpener = null;

                $technologies.removeClass(CLASS.showLoader);
            },

            initLoadEvents = function () {

                ns.$win.on("hashchange.TechnologiesLoader." + ns, function () {

                    if (shouldBeLoadedByHash()) {

                        load();
                    }
                });

                ns.$win.on("main-nav__target-changed.TechnologiesLoader." + ns, function (event, target) {

                    clearTimeout(sectionTargetsLoadDebounce);

                    if (target.match(SECTION_TARGETS_REGEX) && currentState <= STATE.INIT) {

                        sectionTargetsLoadDebounce = setTimeout(function() {

                            if (currentState <= STATE.INIT) {

                                if (window.requestIdleCallback) {

                                    loadIdleCallback = window.requestIdleCallback(load);

                                } else {

                                    load();
                                }
                            }
                        }, SECTION_TARGETS_LOAD_DELAY);
                    }
                });

                $openers.on(["mouseenter", "touchstart", "keydown", "click"].join(".TechnologiesLoader." + ns + " ") + ".TechnologiesLoader." + ns, function (event) {

                    ns.$temp[0] = event.currentTarget;

                    if (event.type === "click") {

                        event.preventDefault();

                        if (currentState < STATE.LOADED) {

                            if (ns.$temp.is(SELECTOR.btn)) {

                                if (elOpener === event.currentTarget) {

                                    elOpener = null;

                                    ns.$temp.removeClass(CLASS.btnError)
                                        .removeClass(CLASS.btnProgress);

                                    return;
                                }

                                ns.$temp.removeClass(CLASS.btnError)
                                    .addClass(CLASS.btnProgress);

                            } else {

                                $technologies.addClass(CLASS.showLoader);
                            }

                            elOpener = event.currentTarget;
                        }

                        if (currentState <= STATE.INIT) {

                            initTab = ns.$temp.data(DATA.tab);

                            load();
                        }
                    } else {

                        if (currentState <= STATE.INIT) {

                            initTab = ns.$temp.data(DATA.tab);

                            if (window.requestIdleCallback) {

                                loadIdleCallback = window.requestIdleCallback(load);

                            } else {

                                load();
                            }
                        }
                    }
                });
            },

            initEvents = function () {

                $technologiesLoader.on("click." + ns + " touchend." + ns, cancelLoader);

                ns.$win.on("keyup.TechnologiesLoader" + ns, function (event) {

                    if (event.which === 27) { //ESC

                        cancelLoader();
                    }
                });
            },

            init = function () {

                $technologies = $(SELECTOR.technologies);
                $technologiesLoader = $(SELECTOR.technologiesLoader);

                if (shouldBeLoadedByHash()) {

                    load();

                } else {

                    $openers = $(SELECTOR.openers);

                    initLoadEvents();
                }

                initEvents();
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

    ns.CustomScrollbarLoader = (function () {

        var EVENT = {
                loaded: "custom-scrollbar__loaded." + ns
            },

            JS_TO_LOAD = "libs/malihu-custom-scrollbar-plugin-3.1.5/jquery.mCustomScrollbar.concat.min.js",
            CSS_TO_LOAD = "libs/malihu-custom-scrollbar-plugin-3.1.5/jquery.mCustomScrollbar.css",

            TECHNOLOGIES_HASH_REGEX = /^#(html|css|js)$/i,

            onLoad = function (event) {

                if (event.target.tagName.toLowerCase() === "link") {

                    CSS_TO_LOAD = null;
                }

                if (event.target.tagName.toLowerCase() === "script") {

                    JS_TO_LOAD = null;
                }

                if (!CSS_TO_LOAD && !JS_TO_LOAD) {

                    ns.$win.trigger(EVENT.loaded);
                }
            },

            load = function () {

                var elScript = document.createElement("script"),
                    elLink = document.createElement("link");

                elScript.defer = true;
                elScript.async = false;
                elScript.src = JS_TO_LOAD;
                elScript.onload = onLoad;

                elLink.rel = "stylesheet";
                elLink.href = CSS_TO_LOAD;
                elLink.onload = onLoad;

                document.head.appendChild(elScript);
                document.head.appendChild(elLink);
            },

            shouldBeLoaded = function () {

                var style = document.body.style;

                return typeof style.webkitOverflowScrolling === "undefined" && typeof style.scrollbarWidth === "undefined" &&
                    !document.documentElement.className.match(/android/);
            },

            technologiesShouldBeOpened = function () {

                return window.location.hash && window.location.hash.match(TECHNOLOGIES_HASH_REGEX);
            },

            init = function () {

                if (shouldBeLoaded()) {

                    if (technologiesShouldBeOpened()) {

                        load();

                    } else if (window.requestIdleCallback) {

                        window.requestIdleCallback(load);

                    } else {

                        setTimeout(load, 0);
                    }
                }
            };

        return {
            init: init,
            shouldBeLoaded: shouldBeLoaded
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax, Infinitum*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$temp = ns.$temp || $([null]);

    ns.References = (function () {

        var ID = {
                self: "reference"
            },

            CLASS = {
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
                btnWrapper: ".references__project-btn-wrapper",

                background: ".references__background",
                backgroundLayers: ".references__background-layer",
                findSquare: ".square"
            },

            EVENT = {
                changed: "references__changed"
            },

            TAB_SWITCH_QUEUE = "tab." + ns,

            STAGGER_DELAY = 30,
            TAB_SWITCH_DELAY = 300,

            $self,
            $tabsWrapper,
            $tabs,
            $activeTab,

            initialImageLoadStarted,

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

                    $currentTab.find(SELECTOR.btnWrapper)
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

                    $tabToShow.find(SELECTOR.btnWrapper)
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

                var href = ns.$temp.find(SELECTOR.navLink)[0].href.split("#")[1],
                    isIndex = $activeTab.index(),
                    willIndex = ns.$temp.index(),

                    $tabToShow = $self.find(SELECTOR.tab).eq(willIndex),

                    $queueEl = $self.stop(TAB_SWITCH_QUEUE + willIndex, true, false);

                $activeTab.removeClass(CLASS.activeTab);

                loadImage($tabToShow);

                buildSwitchAnimation($tabToShow, $queueEl);

                $activeTab = $tabToShow.addClass(CLASS.activeTab);

                window.history.replaceState(null, "", "#" + href);

                $queueEl.dequeue(TAB_SWITCH_QUEUE + isIndex)
                    .dequeue(TAB_SWITCH_QUEUE + willIndex);

                if (isIndex !== willIndex) {

                    ns.$win.trigger(EVENT.changed, href);
                }
            },

            showTabById = function (id) {

                id = "#" + id.replace("#", "");

                if ("#" + $self[0].id === id) {

                    return;
                }

                var $navItem = infinitum.$items
                        .find("[href$='" + id + "']")
                        .closest(Infinitum.CLASS.selector("item"));

                if ($navItem.length) {

                    infinitum.setCurrent($navItem);

                    window.location.hash = "#" + $self[0].id;
                }
            },

            execLoadInitialImage = function () {

                if (initialImageLoadStarted) {

                    return;
                }

                initialImageLoadStarted = true;

                loadImage($tabs.filter(SELECTOR.activeTab));

                ns.$win.off("main-nav__target-changed.References." + ns);
            },

            ensureInitialImageLoad = function () {

                var sectionRect = $self[0].getBoundingClientRect();

                if (window.location.hash === "#" + ID.self ||
                    (sectionRect.top <= window.innerHeight && sectionRect.bottom >= 0)
                ) {

                    setTimeout(loadImage.bind(null, $tabs.filter(SELECTOR.activeTab)), 0);

                    initialImageLoadStarted = true;

                } else {

                    ns.$win.on("main-nav__target-changed.References." + ns, function (event, target) {

                        if (target === ID.self) {

                            execLoadInitialImage();
                        }
                    });
                }
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

                if (window.location.hash) {

                    showTabById(window.location.hash);
                }

                ns.$win.on("hashchange." + ns, function () {

                    showTabById(window.location.hash);
                });
            },

            initTabs = function () {

                $tabsWrapper = $self.find(".references__references");

                $tabs = $tabsWrapper.find(SELECTOR.tab);
                $activeTab = $tabs.filter(SELECTOR.activeTab);

                $tabs.hide();
                $activeTab.show();

                correctWrapperHeight();

                ns.$win.on("resize." + ns + " resize.References." + ns, correctWrapperHeight);

                ensureInitialImageLoad();

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
                    refreshOnResize: false,

                    onBeforeTransform: function ($el, progress, tX, tY, transform) {

                        var layer = this.layers[0].$el === $el ? this.layers[0] : this.layers[1],

                            extention = layer.parallaxYExtention;

                        transform.x += extention * progress;
                    },

                    onFirstIntersection: execLoadInitialImage
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
                    }, 150);
                });
            },

            init = function () {

                $self = $(SELECTOR.self);

                $self.addClass(CLASS.selfJSLoaded);

                initNav();
                initTabs();

                ns.$ParallaxLoader.then(function () {

                    setTimeout(initBackground, 100);
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, Parallax, ParallaxController*/

(function (ns, $) {

    ns.$temp = ns.$temp || $([null]);
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

            applyPhotoFilter = function (el, progress) {

                if (!useFilter) {

                    return;
                }

                $img = $img || $(el).find(SELECTOR.photoImg);

                var recalc = progress > 0 ? Math.max(-1 + (progress * 2), 0) : Math.min(1 + (progress * 2), 0);

                recalc = Math.abs(recalc);

                var filter = (recalc * PHOTO_FILTER).toFixed(3);

                $img.css("filter", "blur(" + filter + "px)");
            },

            /*checkPhotoPosition = function () {

                var selfRect = parallax.$parallax[0].getBoundingClientRect(),
                    photoRect = parallax.$layers[0].getBoundingClientRect();

                if (photoRect.bottom < selfRect.bottom) {

                    ParallaxController.refresh(true);

                    setTimeout(checkPhotoPosition, 1000);
                }
            },*/

            init = function (debug) {

                ns.$ParallaxLoader.then(function () {

                    setTimeout(function() {

                        parallax = new Parallax({
                            parallax: SELECTOR.self,
                            layers: SELECTOR.photo,
                            fakeTilt: false,
                            refreshOnResize: false,

                            onTransform: applyPhotoFilter
                        });

                        ns.$win.on("lowperformance." + ns, function () {

                            useFilter = false;

                            ns.$temp[0] = parallax.elLayers[0];

                            ns.$temp.find(SELECTOR.photoImg)
                                .css("filter", "none");
                        });

                        if (debug) {

                            ns.$win.on("resize", function () {

                                ns.$win.scrollTop($(SELECTOR.self).offset().top);
                            });
                        }
                    }, 100);
                });
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

                        ns.$win.trigger("bg-object-opacity-animation__add." + ns, [$bgLayers, SELECTOR.findSquare]);

                    }, 150);
                });
            },

            init = function () {

                $self = $(SELECTOR.self);

                $termsAndConditions = $self.find(SELECTOR.termsAndConditions);

                $self.find(SELECTOR.termsAndConditionsLink)
                    .on("click." + ns, showTermsAndConditions);

                ns.$ParallaxLoader.then(function () {

                    setTimeout(initBackground, 150);
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

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
 * získá třídu "form--ok" a spustí se událost EVENT.success, jinak získá třídu "form--error"
 * a spustí se událost EVENT.error.
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
                events: "events." + ns + ".Form",

                error: "error." + ns + ".Form"
            },

            EVENT = {
                success: "form__success." + ns,
                error: "form__error." + ns
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

                ns.$win.trigger(EVENT.success, [this]);
            },

            onFail = function (validationFailed, customErrors) {

                if (customErrors) {

                    removeErrors(this);

                    showErrors(this, customErrors);
                }

                setResultState(this, false, validationFailed || (customErrors && !$.isEmptyObject(customErrors)));

                ns.$win.trigger(EVENT.error, [this, validationFailed || customErrors, customErrors]);
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

/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, ga, window, document*/

(function (ns, $) {

    ns.Analytics = (function () {

        ns.$win = ns.$win || $(window);
        ns.$doc = ns.$doc || $(document);
        ns.$temp = ns.$temp || $([null]);

        var DATA = {
                eventClick: "analytics-event-click"
            },

            SELECTOR = {
                eventClick: "[data-" + DATA.eventClick + "]"
            },

            CATEGORY = {
                FORM: "form",
                WEB: "web",
                SECTION: "sekce",
                REFERENCES: "reference"
            },

            DATA_DELIMITER = "|",

            PAGE_VIEW_TIMEOUT = 3000,

            VISIBILITY_DEBOUNCE = 2000,

            lastSection = (window.location.hash || "#uvod").replace("#", ""),
            lastSectionFrom = new Date(),

            lastSentSection = lastSection,

            hiddenFrom = document.hidden ? new Date() : null,

            visibilitychangeDebounce,
            visibilitychangeDebounceFn,

            sendPageViewDebounce,
            sendPageViewDebounceFn,

            pageExitInitialized = false,

            getHiddenTime = function (debounceTime) {

                return (((new Date() - debounceTime) - hiddenFrom) / 1000).toFixed(1);
            },

            getLastSectionTime = function () {

                return ((new Date() - lastSectionFrom) / 1000).toFixed(1);
            },

            clearPageView = function () {

                if (sendPageViewDebounceFn) {

                    clearTimeout(sendPageViewDebounce);

                    sendPageViewDebounceFn();
                }
            },

            clearVisibilitychange = function () {

                if (visibilitychangeDebounceFn) {

                    clearTimeout(visibilitychangeDebounce);

                    visibilitychangeDebounceFn();
                }
            },

            initPageExitTime = function () {

                ns.$win.on("unload." + ns, function () {

                    clearVisibilitychange();

                    sendEvent("exit", CATEGORY.WEB, "Poslední sekce: " + lastSection + "; " + getLastSectionTime() + "s.");
                });
            },

            sendSectionExit = function () {

                if (lastSentSection) {

                    if (lastSentSection.match(/^#?reference-/)) {

                        lastSentSection = "reference";
                    }

                    sendEvent("exit", CATEGORY.SECTION, "Sekce: " + lastSentSection + "; " + getLastSectionTime() + "s.", true);

                    lastSentSection = null;
                }
            },

            sendReferenceChange = function (event, target) {

                clearVisibilitychange();

                target = target.replace(/#?reference-/, "");

                sendEvent("change", CATEGORY.REFERENCES, "Reference: " + target);
            },

            sendPageView = function (event, target) {

                target = (target || window.location.hash || "").replace("#", "");

                if (target && target.match(/^reference-/)) {

                    target = "reference";
                }

                clearTimeout(sendPageViewDebounce);

                sendPageViewDebounceFn = function () {

                    clearVisibilitychange();

                    if (typeof window.ga === "function") {

                        ga("set", "page", "#" + target);
                        ga("send", "pageview");
                    }

                    if (!pageExitInitialized) {

                        initPageExitTime();

                        pageExitInitialized = true;
                    }

                    lastSentSection = target;

                    sendPageViewDebounceFn = null;
                };

                sendPageViewDebounce = setTimeout(sendPageViewDebounceFn, PAGE_VIEW_TIMEOUT);

                sendSectionExit();

                lastSection = target;
                lastSectionFrom = new Date();
            },

            parseEventData = function (el) {

                ns.$temp[0] = el;

                var data = ns.$temp.data(DATA.eventClick),

                    dataArr = data ? data.split(DATA_DELIMITER) : [];

                return {
                    eventCategory: dataArr[0] || "unknown",
                    eventLabel: dataArr[1] || "unknown"
                };
            },

            sendEvent = function (action, elOrCategory, label, skipClearPageView) {

                clearVisibilitychange();

                if (!skipClearPageView) {

                    clearPageView();
                }

                if (typeof window.ga === "function") {

                    var data = typeof elOrCategory === "string" ? {} : parseEventData(elOrCategory);

                    data.hitType = "event";
                    data.eventAction = action || "unknown";

                    data.eventCategory = data.eventCategory || elOrCategory || "unknown";
                    data.eventLabel = data.eventLabel || label || "unknown";

                    ga("send", data);
                }
            },

            onClick = function (event) {

                if (event.type === "mouseup" && event.originalEvent.button !== 1) {

                    return;
                }

                sendEvent("click", event.currentTarget);
            },

            onKeyup = function (event) {

                if (event.which === 123) {

                    sendEvent("F12", CATEGORY.WEB, "Developer Tools");
                }
            },

            onVisibilitychange = function () {

                if (!document.hidden) {

                    clearTimeout(visibilitychangeDebounce);

                    visibilitychangeDebounceFn = function() {

                        var debounceTime = new Date() - visibilitychangeDebounceFn.debounceStartTime;

                        visibilitychangeDebounceFn = null;

                        sendEvent("visibilitychange", CATEGORY.WEB, "Skrytý: " + getHiddenTime(debounceTime) + "s");
                    };

                    visibilitychangeDebounceFn.debounceStartTime = new Date();

                    visibilitychangeDebounce = setTimeout(visibilitychangeDebounceFn, VISIBILITY_DEBOUNCE);

                    return;
                }

                clearTimeout(visibilitychangeDebounce);

                if (!visibilitychangeDebounceFn) {

                    hiddenFrom = new Date();
                }

                visibilitychangeDebounceFn = null;
            },

            onFormSent = function () {

                sendEvent("sent", CATEGORY.FORM, "Odeslán formulář.");
            },

            init = function () {

                ns.$win.on([
                    "main-nav__target-changed." + ns,
                    "technologies__changed." + ns,
                    "technologies__closed." + ns
                ].join(" "), sendPageView);

                ns.$win.on("references__changed." + ns, sendReferenceChange);

                ns.$win.on("keyup." + ns, onKeyup);

                ns.$win.on("visibilitychange." + ns, onVisibilitychange);

                ns.$win.on("form__success." + ns, onFormSent);

                ns.$doc.on("click." + ns + " mouseup." + ns, SELECTOR.eventClick, onClick);
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));

/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, window*/

(function() {

    if (!window.MJNS) {

        return;
    }

    var NS = window.MJNS,
        PROD = NS.ENV.match(/^prod/i);

    jQuery(window).on("load", function () {

        var idleCallback = window.requestIdleCallback || function (fn) { return setTimeout(fn, 0); },

            loadCookies = document.cookie.indexOf("cookieconsent_status=dismiss") === -1,

            scriptsToLoad = [
                PROD ? "build/background.build.min.js?v=" + NS.VERSION: null,
                PROD ? "build/ConsoleMessage.build.min.js?v=" + NS.VERSION: "js/modules/ConsoleMessage.js",
                PROD ? loadCookies ? "build/Cookies.build.min.js?v=" + NS.VERSION: null: "js/modules/Cookies.js"
            ].filter(function (src) { return src; });

        idleCallback(function () {

            scriptsToLoad.forEach(function (src) {

                idleCallback(function () {

                    var elScript = document.createElement("script");

                    elScript.async = true;
                    elScript.src = src;

                    document.body.appendChild(elScript);
                });
            });
        });
    });

    jQuery(function () {

        var modules = ["$ParallaxLoader", "$BGObjectsOpacityAnimation", "$Cookies", "CustomScrollbarLoader", "Performance", "Visibility", "JSHover", "BreakText", "Intro", "SmallCaps", "Offer", "TechnologiesLoader", "References", "AboutMe", "Pricelist", "Form", "Contact", "Fonts", "FixBugs", "Analytics", "$ConsoleMessage", "MainNav"];

        modules.forEach(function (moduleName) {

            moduleName = moduleName || "";

            if (NS[moduleName] && typeof NS[moduleName].init === "function") {

                NS[moduleName].init();

            } else if ((NS[moduleName] && typeof NS[moduleName].then === "function") || moduleName.indexOf("$") === 0) {

                if (!NS[moduleName]) {

                    NS[moduleName] = jQuery.Deferred();
                }

                NS[moduleName].then(function () {

                    moduleName = moduleName.replace(/^\$/, "");

                    if (NS[moduleName] && typeof NS[moduleName].init === "function") {

                        NS[moduleName].init();
                    }
                });
            }
        });
    });
}());
