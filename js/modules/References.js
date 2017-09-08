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

                }, 50);
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
