/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

jQuery(function () {

    if (!window.MJNS) {

        return;
    }

    if (window.MJNS.Performance) {

        window.MJNS.Performance.init();
    }

    if (window.MJNS.JSHover) {

        window.MJNS.JSHover.init();
    }

    if (window.MJNS.BreakText) {

        window.MJNS.BreakText.init();
    }

    if (window.MJNS.MainNav) {

        window.MJNS.MainNav.init();
    }

    if (window.MJNS.Intro) {

        window.MJNS.Intro.init();
    }

    if (window.MJNS.SmallCaps) {

        window.MJNS.SmallCaps.init();
    }

    if (window.MJNS.Offer) {

        window.MJNS.Offer.init();
    }

    if (window.MJNS.Technologies) {

        window.MJNS.Technologies.init();
    }

    if (window.MJNS.References) {

        window.MJNS.References.init();
    }
});
