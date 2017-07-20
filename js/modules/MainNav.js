/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);
    ns.$doc = ns.$doc || $(document);
    ns.$temp = ns.$temp || $([null]);

    ns.MainNav = (function () {

        $.easing["mainNav." + ns] = function (x) {
            return 1 - Math.pow(1 - x, 3);
        };

        var CLASS = {
                hidden: "main-nav--hidden",
                stopAnim: "main-nav--stop-anim",
                fixableFixed: "main-nav--fixed",

                activeItem: "main-nav__item--active",

                itemsTopOverflow: "main-nav__items--has-top-overflow",
                itemsBottomOverflow: "main-nav__items--has-bottom-overflow"
            },

            SELECTOR = {
                self: ".main-nav",

                itemsWrapper: ".main-nav__items",
                item: ".main-nav__item",
                activeItem: "." + CLASS.activeItem,
                link: ".main-nav__link",

                opener: "#main-nav__mobile-opener",

                fixedElement: ".main-nav",

                localLink: "a[href^='#']:not([href='#'])",

                scrollTarget: "[data-main-nav-target='true']"
            },

            DATA = {
                focus: "main-nav-focus",
                active: "main-nav-active",
                scrollTo: "main-nav-scroll-to"
            },

            SCROLL_DURATION_BASE = 350,

            AUTOHIDE = 10000,

            initialized = false,

            byTouch = false,

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

            $opener,
            onOpenerToggleTimeout,

            skipFindItemToActivate,
            skipFindItemToActivateTimeout,

            getFixPosition = function () {

                var styles = window.getComputedStyle($self[0]);

                return $opener.prop("checked") || styles.getPropertyValue("--focus-within") || styles.getPropertyValue("--pointer") ? 0 : 100;
            },

            getScrollOffset = function () {

                return 0;
            },

            updateHistory = function ($link) {

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

                $scrollingElement.animate({ scrollTop: scrollTop }, {

                    duration: scrollDuration,

                    easing: "mainNav." + ns,

                    step: function () {

                        hideNav = scrollTop > 0;
                    },
                    complete: onComplete
                });
            },

            getScrollDuration = function (targetScrollTop) {

                return SCROLL_DURATION_BASE + (SCROLL_DURATION_BASE * Math.abs(ns.$win.scrollTop() - targetScrollTop) / getScrollableHeight());
            },

            scrollToTarget = function (event) {

                if (!isLocalLink(event.currentTarget)) {

                    return;
                }

                byTouch = event.type.match(/touch/);

                var targetId = (event.currentTarget.href || "").split("#")[1],

                    $link = $(event.currentTarget),

                    $scrollTarget = $("#" + targetId);

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
                            linkInsideNav ? $link : $self.find("[href*='#" + targetId + "']")
                        );
                    }

                    animate(
                        scrollTargetTop,
                        getScrollDuration(scrollTargetTop),
                        moveFocus.bind(null, $scrollTarget, $link)
                    );

                    $scrollTarget.attr("id", targetId);

                    event.preventDefault();
                }
            },

            isTargetInView = function (rect) {

                return rect.top <= window.innerHeight / 4 && rect.bottom > window.innerHeight / 4;
            },

            findCurrentScrollTarget = function () {

                var currentScrollTarget,
                    currentScrollTargetTop = null;

                $scrollTargets.each(function (i, target) {

                    var rect = target.getBoundingClientRect();

                    if (isTargetInView(rect) && (rect.top > currentScrollTargetTop || currentScrollTargetTop === null)) {

                        currentScrollTarget = target;

                        currentScrollTargetTop = rect.top;
                    }
                });

                return currentScrollTarget;
            },

            findLinkToActivate = function () {

                //nevyhledávat aktivní odkaz, pokud se stránka posouvá kliknutím na odkaz v menu
                if (skipFindItemToActivate) {

                    clearTimeout(skipFindItemToActivateTimeout);

                    skipFindItemToActivateTimeout = setTimeout(function() {

                        skipFindItemToActivate = false;

                    }, 150);

                    return;
                }

                var currentScrollTarget = findCurrentScrollTarget();

                if (currentScrollTarget) {

                    ns.$temp[0] = currentScrollTarget;

                    var activeSelector = ns.$temp.attr("data-" + DATA.active),

                        $link = activeSelector ? $(activeSelector) : $self.find("[href*='#" + currentScrollTarget.id + "']");

                    activateItem($link, true);

                    updateHistory($link);
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

            initEvents = function () {

                ns.$doc.on("click." + ns, SELECTOR.localLink, scrollToTarget);

                ns.$win.on("scroll." + ns, findLinkToActivate)
                    .on("scroll." + ns, fixNav);

                ns.$win.on("mousewheel." + ns + " DOMMouseScroll", onScroll);

                $itemsWrapper.on("mouseover." + ns, onMouseoverItemsWrapper)
                    .on("scroll." + ns, setScrollableState);

                $opener.on("change." + ns, onOpenerToggle);

                ns.$win.scroll();
            },

            initElements = function () {

                $scrollingElement = $("html, body");

                $self = $(SELECTOR.self);

                $itemsWrapper = $self.find(SELECTOR.itemsWrapper);

                $fixedElement = $(SELECTOR.fixedElement);

                $opener = $self.find(SELECTOR.opener);

                $scrollTargets = $(SELECTOR.scrollTarget);
            },

            init = function () {

                initElements();

                initEvents();

                initialized = true;
            };

        return {
           init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
