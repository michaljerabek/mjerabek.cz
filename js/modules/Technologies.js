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
                changed: "technologies__changed." + ns,
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

            THEME_COLOR = "#C9B47F",

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

            isOpened = false,

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

            close = function (event, hideOnly) {

                cancelPreventScroll();

                ns.$win.off("keyup.Technologies" + ns);

                $inertEl.prop("inert", false);
                $self.prop("inert", true);

                if (!hideOnly) {

                    openedByEl.focus();
                }

                setPagePerspective();

                $metaThemeColor.attr("content", savedThemeColor);

                if (!hideOnly) {

                    var hash = "#" + ns.Offer.getSelf()[0].id;

                    window.history.replaceState(hash, "", hash);
                }

                $toggleEl.removeClass(CLASS.toggle);
                $self.removeClass(CLASS.showCodeSample);

                ns.$win.trigger(EVENT.closed);

                if (event) {

                    event.preventDefault();
                }

                $self.on("transitionend." + ns, function (event) {

                    if (event.originalEvent.propertyName === "visibility" && event.originalEvent.target === $self[0]) {

                        $self.off("transitionend." + ns)
                            .css("display", "none");
                    }
                });

                isOpened = false;
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

                event.preventDefault();

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

                isOpened = true;
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

                    ns.$win.trigger(EVENT.changed, $link[0].href.split("#")[1]);

                }, 0);
            },

            openById = function (id) {

                id = "#" + id.replace("#", "");

                if (isOpened) {

                    var $navItem = infinitum.$items
                            .find("[href$='" + id + "']")
                            .closest(Infinitum.CLASS.selector("item"));

                    if ($navItem.length) {

                        infinitum.setCurrent($navItem);
                    }

                    return !!$navItem.length;
                }

                var $opener = ns.Offer.find("[href*='" + id + "']");

                if ($opener.length) {

                    $opener.click();
                }

                return !!$opener.length;
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

                $openers.one("mouseenter." + ns + " touchstart." + ns + " keydown." + ns, function () {

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

                    openById(window.location.hash);
                }

                ns.$win.on("hashchange." + ns, function () {

                    if (!openById(window.location.hash) && isOpened) {

                        close(null, true);
                    }
                });
            };

        return {
            init: init
        };

    }());

}((function (ns) { window[ns] = window[ns] || { toString: function () { return ns; } }; return window[ns]; }("MJNS")), jQuery));
