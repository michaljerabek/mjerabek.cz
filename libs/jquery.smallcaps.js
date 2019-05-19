/*!
 * jQuery SmallCaps
 *
 * Demo: https://jsfiddle.net/jbuncle/9wwrkbrf/
 *
 * Copyright 2013 James Buncle
 *
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */
(function($) {
    var $temp = $([null]),
        hasStyles = false;
    $.fn.smallCaps = function() {
        if (!hasStyles) {
            addStyles();
            hasStyles = true;
        }
        $.each($(this).contents(), function(index, obj) {
            processNode(obj);
        });
        return this;
    };
    function addStyles() {
        var style = document.createElement("style");
        style.innerHTML = [
            ".small-caps { \n\tfont-variant: normal; \n\ttext-transform: uppercase; \n}\n\n",
            ".small-caps--upper { \n\tfont-size: 1em; \n}\n\n",
            ".small-caps--lower { \n\tfont-size: 0.7em; \n}"
        ].join("");
        document.head.appendChild(style);
    }
    function processNode(element) {
        if (element.nodeType === 3) {
            var text = element.textContent;
            if (text !== undefined) {
                if (text.trim().length > 0) {
                    var newText = convertText(text);
                    $temp[0] = element;
                    $temp[0] = $temp.replaceWith(newText);
                    /*$temp.css({
                        border: '0 none'
                    });*/
                }
            }
        }
    }
    function convertText(text) {
        var newText = "";

        var currUppers = "";
        var currLowers = "";
        var charIndex;
        for (charIndex = 0; charIndex < text.length; charIndex++) {
            var currChar = text.charAt(charIndex);
            if (isUpper(currChar)) {
                if (currLowers !== "") {
                    newText += wrapLower(currLowers);
                    currLowers = "";
                }
                currUppers += currChar;
            } else {
                if (currUppers !== "") {
                    newText += wrapUpper(currUppers);
                    currUppers = "";
                }
                currLowers += currChar;
            }
        }
        if (currLowers !== '') {
            newText += wrapLower(currLowers);
        }
        //Wrap up remainder
        if (currUppers !== '') {
            newText += wrapUpper(currUppers);
        }
        return newText;
    }
    function isUpper(character) {
        return character.toUpperCase() === character;
    }
    function wrapUpper(text) {
        return "<span class='small-caps small-caps--upper'>" + text + "</span>";
    }
    function wrapLower(text) {
        return "<span class='small-caps small-caps--lower'>" + text + "</span>";
    }
    function hasChildren($obj) {
        return $obj.length > 0;
    }
})(jQuery);
