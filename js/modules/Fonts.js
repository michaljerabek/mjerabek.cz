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
