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
