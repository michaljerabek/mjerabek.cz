/*global process, document, exports*/

/* Soubor slouží k načítání a spojování JS souborů.
 * Pokud je soubor spuštěn v prohlížeči, vloží do stránky
 * vývojové soubory pomocí elementů script. Pokud je spuštěn
 * v Node.js, vrátí objekt s nastavením pro spojení souborů.
 *
 * Do objektu FILES se jako název vlastnosti zadá název
 * spojeného souboru a jako její hodnota se zadá pole
 * s cestami k souborům.
 *
 * Soubory je možné spojit gulp-taskem js. Výstupní složka
 * se nastavuje v /dev/PATHS.js (PATHS.JS_OUTPUT).
 *
 * Pokud se používá tento soubor i pro vývoj, pak je potřeba,
 * aby element script měl atribut data-files, do kterého se
 * zadají názvy polí souborů oddělené čárkou, které se mají
 * pro danou stránku použit. (Není-li atribut zadán, použije
 * se první hodnota.) Do stránky se také musí vložit
 * /dev/PATHS.js.
 *
 * K dispozi jsou funkce pro vytvoření cest k souborům podle
 * nastavení v /dev/PATHS.js:
 *
 * file(): JS soubory stránky
 *     relativePathToJSFiles (String): cesta relativní
 *          k PATHS.JS_FILES
 *
 * comp(): JS moduly
 *     relativePathToModules (String): cesta relativní
 *          k PATHS.JS_MODULES
 *
 * lib(): JS soubory knihoven a pluginů
 *     relativePathToLibsFiles (String): cesta relativní
 *          k PATHS.LIBS_FILES
 *
 * Cesty zadávejte bez počátečního lomítka.
 *  */

(function (file, mod, lib, _insert, _isBuild) {

    var FILES = {
            "libs.build.js": [
                lib("infinitum/infinitum.js")
            ],

            "main.build.js": [
                mod("Performance.js"),
                mod("Visibility.js"),
                mod("BreakText.js"),
                mod("JSHover.js"),
                mod("Intro.js"),
                mod("MainNav.js"),
                mod("Offer.js"),
                mod("TechnologiesLoader.js"),
                mod("CustomScrollbarLoader.js"),
                mod("References.js"),
                mod("AboutMe.js"),
                mod("Pricelist.js"),
                mod("Form.js"),
                mod("Contact.js"),
                mod("Fonts.js"),
                mod("FixBugs.js"),

                file("init.js")
            ],

            "technologies.build.js": [
                lib("inert-polyfill/inert-polyfill.min.js"),

                mod("Technologies.js")
            ],

            "background.build.js": [
                lib("fulltilt.min.js"),
                lib("parallax.js"),

                mod("BGObjectsOpacityAnimation.js"),
                mod("$ParallaxLoader.js")
            ],

            "offer-features-animations.build.js": [
                mod("OfferFeaturesAnimations.js")
            ],

            "ConsoleMessage.build.js": [
                mod("ConsoleMessage.js")
            ],

            "codesample.build.js": [
                mod("CodeSample/CodeSample.js")
            ]
        };

    return _isBuild ? (exports.files = FILES) : _insert(FILES);
}(

    function (relativePathToJSFiles /*String*/) {
        return this.MJNS.__dev.PATHS.JS_FILES + "/" + relativePathToJSFiles;
    },

    function (relativePathToModules /*String*/) {
        return this.MJNS.__dev.PATHS.JS_MODULES + "/" + relativePathToModules;
    },

    function (relativePathToLibsFiles /*String*/) {
        return this.MJNS.__dev.PATHS.LIBS_FILES + "/" + relativePathToLibsFiles;
    },


    function (files) {

        var self = document.querySelector("[src$=\"" + this.MJNS.__dev.PATHS.JS_LOAD + "\"]"),
            fileNames = self.getAttribute("data-files") || Object.keys(files)[0];

        fileNames = JSON.parse(JSON.stringify(fileNames.split(/\s*,\s*/)));

        fileNames.forEach(function (fileName) {

            if (files[fileName]) {

                files[fileName].forEach(function (file) {
                    document.write("<script src=\"" + file + "\" defer></script>");
                });
            }
        });
    },


    typeof process !== "undefined" && process.versions != null && process.versions.node != null
));
