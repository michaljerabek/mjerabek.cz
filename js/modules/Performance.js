/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (ns, $) {

    ns.$win = ns.$win || $(window);

    ns.Performance = (function () {

        var TRASHHOLD = 45,
            TRASHHOLD2 = 30,

            fps = [60, 60, 60, 60],
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

                    lastState++;
                }

                if (currentFps < TRASHHOLD2 && lastState === 1) {

                    ns.$win.trigger("verylowperformance." + ns, [currentFps]);

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
