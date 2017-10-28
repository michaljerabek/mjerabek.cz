/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, FULLTILT*/

(function () {

    var TRANSFORM_PROP = (function () {

            var el = document.createElement("div"),

                prefixes = ["o", "ms", "moz", "webkit"],

                use = "transform",

                p = prefixes.length - 1, prop;

            for (p; p >= 0; p--) {

                prop = prefixes[p] + "Transform";

                if (el.style[prop] !== undefined) {

                    return prop;
                }
            }

            return use;
        }()),

        TRANSFORM_3D = (function () {

            var el = document.createElement("div");

            el.style[TRANSFORM_PROP] = "translate3d(0,0,0)";

            return !!el.style[TRANSFORM_PROP] && !window.navigator.userAgent.match(/Trident/);
        }()),

        SUPPORTS_TRANSFORM = document.body.style[TRANSFORM_PROP] !== undefined;

    var ParallaxController = window.ParallaxController = (function () {

        var TILT_LIMIT = 67.5,
            FAKE_TILT_REDUCER = 0.5,

            TYPE_TILT = 1,
            TYPE_SCROLL = 2,
            TYPE_FAKE_TILT = 3,

            isMobile = /Mobi/.test(navigator.userAgent),

            initialized = false,
            watchingTilt = false,

            instanceCounter = 0,
            parallaxInstances = {},

            refreshDebounce = {},

            $win,
            winHeight = 0,
            realWinHeight = 0,
            winWidth = 0,
            winScrollTop = 0,

            initialBeta = null,
            currentTiltX = 0,
            currentTiltY = 0,

            lastTiltWasFake = false,

            updateParallaxesScroll,

            _getRealWinHeight = function () {

                return document.documentElement.clientHeight > window.innerHeight || isMobile ? window.innerHeight : document.documentElement.clientHeight;
            },

            //v případě, že je sekce vidět, zavolá metodu transform příslušného Parallaxu
            updateParallaxes = function (type, parallaxId) {

                winScrollTop = window.pageYOffset || 0;

                var p, parallax, toUpdate = [];

                for (p in parallaxInstances) {

                    if (parallaxInstances.hasOwnProperty(p)) {

                        parallax = parallaxInstances[p];

                        if (parallax.disabled) {

                            return;
                        }

                        if (typeof parallaxId === "string" || typeof parallaxId === "number") {

                            if (parallax.id !== parallaxId) {

                                return;
                            }
                        }

                        if (type === TYPE_TILT && !parallax.useTilt) {

                            return;
                        }

                        //použít fake-tilt pouze v případě, že zařízení nepodporuje tilt a tilt má být použit
                        if (type === TYPE_FAKE_TILT && ((watchingTilt && parallax.useFakeTilt) || !parallax.useFakeTilt || !parallax.useTilt)) {

                            return;
                        }

                        var parallaxOffsetTop = parallax.getOffset(),
                            parallaxBottom = parallaxOffsetTop + parallax.getParallaxHeight(),

                            winBottom = winScrollTop + winHeight;

                        if (winBottom > parallaxOffsetTop && winScrollTop < parallaxBottom) {

                            toUpdate.push(parallax);
                        }
                    }
                }

                for (p = 0; p < toUpdate.length; p++) {

                    toUpdate[p].transform(lastTiltWasFake);
                }
            },

            refresh = function (force) {

                if (force !== true && ($win.height() === winHeight && $win.width() === winWidth)) {

                    return;
                }

                winHeight = $win.height();
                winWidth = $win.width();
                winScrollTop = $win.scrollTop();
                realWinHeight = _getRealWinHeight();

                initialBeta = null;

                $.each(parallaxInstances, function (i, parallax) {

                    if (parallax.options.debounce) {

                        clearTimeout(refreshDebounce[parallax.id]);

                        refreshDebounce[parallax.id] = setTimeout(parallax.refresh.bind(this), parallax.options.debounce);

                    } else {

                        parallax.refresh();
                    }
                });
            },

            onFakeTilt = function (e) {

                if (watchingTilt) {

                    return;
                }

                lastTiltWasFake = true;

                var x = ((e.clientX || 0) / winWidth) * 2,
                    y = ((e.clientY || 0) / winHeight) * 2;

                x = TILT_LIMIT * (x > 1 ? x - 1 : -1 + x);
                y = TILT_LIMIT * (y > 1 ? y - 1 : -1 + y);

                currentTiltX = x * -1 * FAKE_TILT_REDUCER;
                currentTiltY = y * -1 * FAKE_TILT_REDUCER;

                updateParallaxes.call(this, TYPE_FAKE_TILT);
            },

            watchTilt = function () {

                if (!window.FULLTILT || !window.Promise || !window.Float32Array) {

                    return;
                }

                var promise = FULLTILT.getDeviceOrientation();

                promise.then(function(orientationControl) {

                    orientationControl.listen(function() {

                        lastTiltWasFake = false;

                        watchingTilt = true;

                        var euler = orientationControl.getScreenAdjustedEuler();

                        // Don't update CSS position if we are close to encountering gimbal lock
                        if (euler.beta > 85 && euler.beta < 95) {

                            return;
                        }

                        var tiltX = euler.gamma;

                        tiltX = tiltX > 0 ? Math.min(tiltX, TILT_LIMIT) : Math.max(tiltX, TILT_LIMIT * -1);

                        if (!initialBeta) {

                            initialBeta = euler.beta;
                        }

                        var tiltY = euler.beta - initialBeta;

                        tiltY = tiltY > 0 ? Math.min(tiltY, TILT_LIMIT) : Math.max(tiltY, TILT_LIMIT * -1);

                        currentTiltX = tiltX;
                        currentTiltY = tiltY;

                        updateParallaxes.call(this, TYPE_TILT);
                    });

                    refresh(true);
                });
            },

            init = function () {

                if (initialized) {

                    return;
                }

                $win = $(window);

                winHeight = $win.height();
                winWidth = $win.width();
                winScrollTop = $win.scrollTop();
                realWinHeight = _getRealWinHeight();

                updateParallaxesScroll = updateParallaxes.bind(this, TYPE_SCROLL);
                onFakeTilt = onFakeTilt.bind(this);

                window.addEventListener("scroll", updateParallaxesScroll);
                window.addEventListener("mousemove", onFakeTilt);

                $win.on("resize.ParallaxController", refresh);

                if (!watchingTilt) {

                    watchTilt();

                    $win.mousemove();
                }

                initialized = true;
            },

            destroy = function () {

                window.removeEventListener("scroll", updateParallaxesScroll);
                window.removeEventListener("mousemove", onFakeTilt);

                $win.off("resize.ParallaxController");

                initialized = false;
            },

            add = function (parallax) {

                if (!parallaxInstances[parallax.id]) {

                    instanceCounter++;

                    parallaxInstances[parallax.id] = parallax;

                    setTimeout(updateParallaxes.bind(TYPE_SCROLL, parallax.id), 0);
                }
            },

            remove = function (parallax) {

                if (parallaxInstances[parallax.id]) {

                    instanceCounter--;

                    delete parallaxInstances[parallax.id];

                    if (!instanceCounter) {

                        destroy();
                    }
                }
            },

            getRealWinHeight = function () {

                return realWinHeight;
            },

            getWinHeight = function () {

                return winHeight;
            },

            getWinWidth = function () {

                return winWidth;
            },

            getWinScrollTop = function () {

                return winScrollTop;
            },

            getTilt = function () {

                return {
                    x: currentTiltX,
                    y: currentTiltY
                };
            },

            getTiltLimit = function () {

                return TILT_LIMIT;
            };

        return {
            init: init,
            destroy: destroy,
            refresh: refresh,

            add: add,
            remove: remove,

            getTilt: getTilt,
            getTiltLimit: getTiltLimit,
            getWinHeight: getWinHeight,
            getWinWidth: getWinWidth,
            getWinScrollTop: getWinScrollTop,
            getRealWinHeight: getRealWinHeight
        };

    }());

    var Layer = function Layer(el, parallax) {

            this.$el = $(el);

            this.parallax = parallax;

            this.init();
        };

    Layer.prototype.init = function () {

        this.refresh(true);
    };

    Layer.prototype.refresh = function (preserveTransform) {

        var dataReverse = this.$el.data(Layer.DATA.REVERSE.ATTR);

        this.reverseTilt = dataReverse === Layer.DATA.REVERSE.VAL.TILT || dataReverse === Layer.DATA.REVERSE.VAL.BOTH;
        this.reverseScroll = dataReverse === Layer.DATA.REVERSE.VAL.SCROLL || dataReverse === Layer.DATA.REVERSE.VAL.BOTH;

        this.mode = this.$el.data(Layer.DATA.MODE.ATTR) || Layer.DATA.MODE.VAL.SCROLL;

        var CSS = {
            height: ""
        };

        if (!this.parallax.options.preserveStyles) {

            CSS.position = "absolute";
            CSS.top = "50%";
            CSS.left = "50%";
            CSS.bottom = "auto";
            CSS.right = "auto";

            CSS[TRANSFORM_PROP] = TRANSFORM_3D ? "translate3d(-50%, -50%, 0)" : "translate(-50%, -50%)";
        }

        this.$el.css(CSS);

        this.layerHeight = this.$el.outerHeight();
        this.layerWidth = this.$el.outerWidth();

        //velikost zvětšení sekce (polovina)
        this.parallaxXExtention = (this.layerWidth - this.parallax.parallaxWidth) / 2;
        this.parallaxYExtention = (this.layerHeight - this.parallax.parallaxHeight) / 2;

        if (this.mode === Layer.DATA.MODE.VAL.FIXED) {

            var fixedHeight = ParallaxController.getRealWinHeight() + (this.parallaxYExtention * 2);

            this.$el.height(fixedHeight);

            this.layerHeight = this.$el.outerHeight();
        }

        //šířka je větší jak výška => použít na šířku rozměry výšky, jinak při tiltu bude parallax mimo
        if (this.parallaxXExtention > this.parallaxYExtention) {

            this.parallaxXExtention = this.parallaxYExtention;
        }

        if (this.parallax.useTilt) {

            this.tiltScrollRatio = this.parallaxXExtention / this.parallaxYExtention;

            this.parallaxTiltYExtention = this.parallaxYExtention * this.tiltScrollRatio;
            this.parallaxYExtention = this.parallaxYExtention * (1 - this.tiltScrollRatio);
        }

        if (!preserveTransform) {

            this.transform(true);
        }
    };

    Layer.DATA = {};

    Layer.DATA.REVERSE = {
        ATTR: "parallax-reverse",
        VAL: {
            TILT: "tilt",
            SCROLL: "scroll",
            BOTH: "both"
        }
    };

    Layer.DATA.MODE = {
        ATTR: "parallax-mode",
        VAL: {
            FIXED: "fixed",
            SCROLL: "scroll"
        }
    };

    Layer.prototype.transform = (function () {

        if (TRANSFORM_3D) {

            return function (x, y) {

                this.$el[0].style[TRANSFORM_PROP] = x === true ? "translate3d(-50%, -50%, 0)" : x === false ? "" : "translate3d(" + x + "px, " + y + "px, 0)";
            };
        }

        return function (x, y) {

            this.$el[0].style[TRANSFORM_PROP] = x === true ? "translate(-50%, -50%)" : x === false ? "" : "translate(" + x + "px, " + y + "px)";
        };
    }());

    var instanceCounter = 0,

        CLASS = {
            parallax: "parallax",
            layer: "parallax__layer"
        },

        DEFAULTS = {
            parallax: "." + CLASS.parallax + ":eq(0)",
            layers: "." + CLASS.layer,
            useTilt: true,
            fakeTilt: true,
            debounce: 0,
            removeIfNotSupported: false,
            preserveStyles: false,
            onTransform: null,
            onBeforeTransform: null
        },

        loadElements = function (options) {

            if (typeof options.parallax === "string" || (window.HTMLElement && options.parallax instanceof window.HTMLElement)) {

                this.$parallax = $(options.parallax);

            } else if (options.parallax.jquery) {

                this.$parallax = options.parallax;
            }

            if (typeof options.layers === "string") {

                this.$layers = this.$parallax.find(options.layers);

            } else if (window.HTMLElement && options.layers instanceof window.HTMLElement) {

                this.$layers = $(options.layers);

            } else if (options.layers.jquery) {

                this.$layers = options.layers;
            }
        },

        Parallax = window.Parallax = function Parallax(options) {

            DEFAULTS.parallax = "." + CLASS.parallax + ":eq(" + instanceCounter + ")";

            this.id = "Parallax-" + (instanceCounter++);

            this.options = typeof options === "string" ? { parallax: options } : options;

            this.disabled = false;

            this.refresh(this.options || DEFAULTS, true);
        };

    Parallax.prototype.destroy = function () {

        if (this.$layers) {

            var layer = this.layers.length - 1;

            for (layer; layer >= 0; layer--) {

                this.layers[layer].transform(false);
            }
        }

        this.$parallax = null;
        this.$layers = null;

        this.layers = [];

        ParallaxController.remove(this);

        this.initialized = false;
    };

    Parallax.prototype.refresh = function (options, elements) {

        if (!SUPPORTS_TRANSFORM) {

            options = typeof options === "object" ? $.extend({}, DEFAULTS, options) : this.options;

            loadElements.call(this, options);

            if (this.options.removeIfNotSupported) {

                this.$layers.remove();

            } else if (!this.options.preserveStyles) {

                this.$layers.each($.proxy(function (i, layer) {

                    var $layer = $(layer);

                    $layer.css({
                        top: ($layer.outerHeight() - this.$parallax.outerHeight()) / -2,
                        left: ($layer.outerWidth() - this.$parallax.outerWidth()) / -2
                    });

                }, this));
            }

            return;
        }

        ParallaxController.init();
        ParallaxController.add(this);

        options = typeof options === "object" ? $.extend({}, DEFAULTS, options) : this.options;

        this.options = options;

        this.useTilt = options.useTilt;
        this.useFakeTilt = options.useTilt && options.fakeTilt;

        if (elements || options === true || !this.$parallax || !this.$layers) {

            loadElements.call(this, options);
        }

        if (!this.$parallax.length || !this.$layers.length) {

            return;
        }

        this.parallaxHeight = this.$parallax.outerHeight();
        this.parallaxWidth = this.$parallax.outerWidth();

        this.getOffset();

        //rozsah parallaxu -> kolik pixelů bude efekt viditelný
        this.parallaxXOuterRange = this.parallaxWidth + ParallaxController.getWinWidth();
        this.parallaxYOuterRange = this.parallaxHeight + ParallaxController.getWinHeight();

        if (elements || options === true || !this.layers || !this.layers.length) {

            this.layers = [];

            this.$layers.each(function (i, el) {

                this.layers.push(new Layer(el, this));

            }.bind(this));

        } else {

            var layer = this.layers.length - 1;

            for (layer; layer >= 0; layer--) {

                this.layers[layer].refresh();
            }
        }

        this.initialized = true;

        this.transform();
    };

    Parallax.prototype.getOffset = function () {

        this.offsetTop = this.$parallax.offset().top;

        return this.offsetTop;
    };

    Parallax.prototype.transform = function (ignoreTilt) {

        if (!this.initialized) {

            return;
        }

        var transform = { x: 0, y: 0 },

            //tilt
            tilt = ParallaxController.getTilt(),

            xPerc = this.useTilt && (!ignoreTilt || this.useFakeTilt) ? tilt.x / ParallaxController.getTiltLimit() : 0,
            yPerc = this.useTilt && (!ignoreTilt || this.useFakeTilt) ? tilt.y / ParallaxController.getTiltLimit() : 0,

            parallaxBottom = this.offsetTop + this.parallaxHeight,

            //kolik procent efektu již bylo provedeno (násobí se dvěma pro následující výpočty)
            parallaxProgression = ((parallaxBottom - ParallaxController.getWinScrollTop()) / this.parallaxYOuterRange) * 2;

        parallaxProgression = isFinite(parallaxProgression) ? parallaxProgression : 0;

        parallaxProgression = Math.max(0, Math.min(parallaxProgression, 2));

        //přepočet "parallaxProgression" od středu na rozsah mezi -1 a 1 (označující o kolik % "parallaxExtention" se má obrázek posunout)
        var progressionFromCenter = parallaxProgression > 1 ? (parallaxProgression - 1) * -1: 1 - parallaxProgression,

            realWinHeight = ParallaxController.getRealWinHeight(),

            l = this.layers.length - 1,

            layer,
            layerProgressionFromCenter,

            layerYPerc,
            layerXPerc;

        for (l; l >= 0; l--) {

            layer = this.layers[l];

            layerYPerc = layer.reverseTilt ? yPerc * -1 : yPerc;
            layerXPerc = layer.reverseTilt ? xPerc * -1 : xPerc;

            layerProgressionFromCenter = layer.reverseScroll ? progressionFromCenter * -1 : progressionFromCenter;

            //tilt
            transform.y = ((layer.parallaxTiltYExtention || 0) * layerYPerc);
            transform.x = ((layer.parallaxXExtention * layerXPerc) - (this.parallaxWidth / 2) - layer.parallaxXExtention);

            //scroll
            //odčítá se (this.parallaxHeight / 2), protože obrázek má top: 50%.

            if (layer.mode === Layer.DATA.MODE.VAL.SCROLL) {
                //            transformY = (transformY - (layer.parallaxTiltYExtention || 0) + (layer.parallaxYExtention * layerProgressionFromCenter) - layer.parallaxYExtention - (this.parallaxHeight / 2));
                transform.y = (transform.y + (layer.parallaxYExtention * layerProgressionFromCenter) - (layer.layerHeight / 2));

            } else {

                transform.y = transform.y + (layer.parallaxYExtention * -layerProgressionFromCenter) + (((realWinHeight + this.parallaxHeight) / 2) * (layer.reverseScroll ? -layerProgressionFromCenter : layerProgressionFromCenter)) - (layer.layerHeight / 2);
            }

            if (typeof this.options.onBeforeTransform === "function") {

                this.options.onBeforeTransform.call(this, layer.$el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);

            } else if (this.options.onBeforeTransform instanceof Array && this.options.onTransform[l]) {

                this.options.onBeforeTransform[l].call(this, layer.$el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);
            }

            layer.transform(transform.x, transform.y);

            if (typeof this.options.onTransform === "function") {

                this.options.onTransform.call(this, layer.$el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);

            } else if (this.options.onTransform instanceof Array && this.options.onTransform[l]) {

                this.options.onTransform[l].call(this, layer.$el, layerProgressionFromCenter, layerXPerc, layerYPerc, transform);
            }
        }
    };

    Parallax.prototype.getParallaxHeight = function () {

        return this.parallaxHeight;
    };

    Parallax.prototype.getParallaxWidth = function () {

        return this.parallaxWidth;
    };

    Parallax.prototype.enable = function () {

        this.disabled = false;
    };

    Parallax.prototype.disable = function () {

        this.disabled = true;
    };

}());
