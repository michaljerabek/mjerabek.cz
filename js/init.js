/*jslint indent: 4, white: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery, window*/

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

    if (window.MJNS.BGObjectsOpacityAnimation) {

        window.MJNS.BGObjectsOpacityAnimation.init();
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

    if (window.MJNS.AboutMe) {

        window.MJNS.AboutMe.init();
    }

    if (window.MJNS.Pricelist) {

        window.MJNS.Pricelist.init();
    }

    if (window.MJNS.Form) {

        window.MJNS.Form.init();
    }

    if (window.MJNS.Contact) {

        window.MJNS.Contact.init();
    }

    if (window.MJNS.Fonts) {

        window.MJNS.Fonts.init();
    }

    if (window.MJNS.Cookies) {

        window.MJNS.Cookies.init();
    }

    if (window.MJNS.FixBugs) {

        window.MJNS.FixBugs.init();
    }

    if (window.MJNS.ConsoleMessage) {

        setTimeout(window.MJNS.ConsoleMessage.init, 2000);
    }

});
