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

    Array.prototype.slice.call(document.head.childNodes).forEach(function (node) {

        if (node.nodeType === 8 && node.textContent.match(new RegExp("^-"))) {

            var message = node.textContent.replace(new RegExp("^-"), "").replace(/\s+/g, " ").trim();

            if (navigator.userAgent.match(/firefox|chrome/i)) {

                console.log("%c" + message, "font-family: 'Josefin Sans'; font-size: 17px; font-weight: 400; line-height: 27px; color: #7D6937;");

                return false;
            }

            console.log(message);

            return false;
        }
    });
});
