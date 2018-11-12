/*jslint indent: 4, white: true, nomen: true, unparam: true, node: true, browser: true, devel: true, plusplus: true, regexp: true, sloppy: true, vars: true, esversion: 6 */

const fs = require("fs");
const path = require("path");
const replace = require("gulp-replace");
const cheerio = require("gulp-cheerio");
const gulp = require("gulp");

const PATHS = require(path.resolve("../../dev/PATHS.js")).PATHS;

for (let _path in PATHS) {

    PATHS[_path] = path.resolve(process.cwd(), "../../", PATHS[_path]);
}

function getTagRegExp(tagName) {

    let startTag = `<!--${tagName}-->`,
        endTag = `<!--/${tagName}-->`;

    return new RegExp(`(${startTag})([\\s\\S]*?)(${endTag})`, "gi");
}

/*!!! Tasky je nutné spouštět postupně.*/

const usesSCSS = typeof PATHS.SCSS_OUTPUT !== "undefined";

let utilityFile = usesSCSS ? path.join(PATHS.SCSS_OUTPUT, "all.build.css") : path.join(PATHS.CSS_FILES, "utility.css"),
    utilityContentRegExp = usesSCSS ? /--- UTILITY ---[\s\S]+?\/\*-+/ : /[\s\S]+/;

gulp.task("styles", () => {

    gulp.src("../index.html", {base: "/manual/js"})
        .pipe(replace(getTagRegExp(usesSCSS ? "css": "scss"), () => ""))
        .pipe(gulp.dest("/manual"));
});

gulp.task("colors", () => {

    return gulp.src(utilityFile, {base: "/manual/js"})
        .pipe(replace(utilityContentRegExp, css => {

            let template;

            gulp.src("../index.html", {base: "/manual/js"})
                .pipe(
                    cheerio({
                        run: $ => {
                            template = $("#template__colors").html();
                        },
                        parserOptions: {
                            normalizeWhitespace: false,
                            decodeEntities: false
                        }
                    })
                )
                .pipe(replace(getTagRegExp("colors"), (match, startTag, content, endTag) => {

                    let colors = css.match(/\.color[0-9]+[^\{]+{[^\}]+}/g) || [];

                    if (colors.length) {

                        let colorNames = colors.map(color => color.match(/\.color-([a-z-]+)/i)).map(color => color ? color[1] : "");

                        colors = colors.map(color => color.split("{")[1].replace(/[;}]/g, "").split(":")[1].trim());

                        colors = colors.map(
                            (color, c) => template.replace(/{{index}}/g, c + 1)
                                .replace(/{{color}}/g, color)
                                .replace(/{{name}}/g, colorNames[c])
                                .replace(/{{class}}/g, colorNames[c] ? "": "hidden")
                            );

                        colors = colors.join("");

                        return `${startTag}${colors}    ${endTag}`;
                    }

                    return `${startTag}    ${endTag}`;
                }))
                .pipe(gulp.dest("/manual"));
        }));
});

gulp.task("fonts", () => {

    return gulp.src(utilityFile, {base: "/manual/js"})
        .pipe(replace(utilityContentRegExp, css => {

            let template;

            gulp.src("../index.html", {base: "/manual/js"})
                .pipe(
                    cheerio({
                        run: $ => {
                            template = $("#template__fonts").html();
                        },
                        parserOptions: {
                            normalizeWhitespace: false,
                            decodeEntities: false
                        }
                    })
                )
                .pipe(replace(getTagRegExp("fonts"), (match, startTag, content, endTag) => {

                    let fonts = css.match(/\.font[0-9]+[^\{]+{[^\}]+}/g) || [];

                    if (fonts.length) {

                        let fontNames = fonts.map(font => font.match(/\.font-([a-z-]+)/i)).map(font => font ? font[1] : "");

                        fonts = fonts.map(font => font.split("{")[1].replace(/[;}]/g, "").split(":")[1].trim());

                        fonts = fonts.map(font => font.split(",").shift().replace(/["']/g, "").trim());

                        fonts = fonts.map(
                            (font, f) => template.replace(/{{index}}/g, f + 1)
                                .replace(/{{font}}/g, font)
                                .replace(/{{name}}/g, fontNames[f])
                                .replace(/{{class}}/g, fontNames[f] ? "": "hidden")
                            );

                        fonts = fonts.join("");

                        return `${startTag}${fonts}    ${endTag}`;
                    }

                    return `${startTag}    ${endTag}`;
                }))
                .pipe(gulp.dest("/manual"));
        }));
});

gulp.task("media", () => {

    const NAME = {
        desktop: "Desktop",
        tablet: "Tablet",
        mobile: "Mobil"
    };

    const SUBNAME = {
        l: "velký",
        m: "střední",
        s: "malý"
    };

    return gulp.src(utilityFile, {base: "/manual/js"})
        .pipe(replace(utilityContentRegExp, css => {

            let template;

            return gulp.src("../index.html", {base: "/manual/js"})
                .pipe(
                    cheerio({
                        run: $ => {
                            template = $("#template__media").html();
                        },
                        parserOptions: {
                            normalizeWhitespace: false,
                            decodeEntities: false
                        }
                    })
                )
                .pipe(replace(getTagRegExp("media"), (match, startTag, content, endTag) => {

                    let media = css.match(/(@media[^}{]+?\{)(?:\s*html \.x-(?:desktop|tablet|mobile)-?[sml]?)/g) || [];

                    if (media.length) {

                        media = media.map(item => [
                            item.replace(/(\s*\{[\s\S]*)|(@media\s*)/g, ""),
                            item.match(/(desktop|tablet|mobile)-?(s|m|l)?/i)
                        ]);

                        media = media.map(item => {

                            let name = NAME[item[1][1]] + (item[1][2] ? ` ${SUBNAME[item[1][2]]}` : ""),
                                _class = item[1][0],
                                viewport;

                            viewport = item[0].match(/[0-9]+/g);

                            if (viewport.length === 2) {

                                viewport = `<span class="small">${viewport[0]}</span>px–<span class="small">${viewport[1]}</span>px`;
                            } else {

                                viewport = `<span class="small">${viewport[0]}</span>px${item[0].match(/min/) ? "+" : "-"}`;
                            }

                            if (!item[1][2]) {

                                name = `<strong>${name}</strong>`;
                                viewport = `<strong>${viewport}</strong>`;
                            }

                            return template.replace(/{{name}}/g, name)
                                .replace(/{{class}}/g, _class)
                                .replace(/{{viewport}}/g, viewport);
                        });

                        media = media.join("");

                        return `${startTag}${media}    ${endTag}`;
                    }

                    return `${startTag}    ${endTag}`;
                }))
                .pipe(gulp.dest("/manual"));
        }));
});

gulp.task("libs", () => {

    const LIBS = {
        libs__jquery: path.join(PATHS.LIBS_FILES, "jq.min.js"),
        libs__svg4everybody: path.join(PATHS.LIBS_FILES, "svg4everybody/dist/svg4everybody.js"),
        libs__slick: path.join(PATHS.LIBS_FILES, "slick/slick.js"),
        libs__blueimpgallery: path.join(PATHS.LIBS_FILES, "blueimp-Gallery/js/blueimp-gallery.js"),
        libs__responsivesvgpicture: path.join(PATHS.LIBS_FILES, "ResponsiveSVGPicture/ResponsiveSVGPicture.js"),
        libs__googlemap: path.join(PATHS.LIBS_FILES, "google-map/googlemap.build.js")
    };

    return gulp.src("../index.html", {base: "/manual/js"})
        .pipe(
            cheerio({
                run: $ => {

                    Object.keys(LIBS).forEach(lib => {

                        if (fs.existsSync(path.resolve(LIBS[lib]))) {

                            $("." + lib).removeAttr("hidden");

                        } else {

                            $("." + lib).attr("hidden", "");
                        }
                    });

                },
                parserOptions: {
                    normalizeWhitespace: false,
                    decodeEntities: false
                }
            })
        )
        .pipe(gulp.dest("/manual"));

});

gulp.task("code", () => {

    const CODE = {
        code__jshover: path.join(PATHS.JS_MODULES, "JSHover.js"),
        code__blueimpgallery: path.join(PATHS.JS_MODULES, "BlueimpGallery.js")
    };

    return gulp.src("../index.html", {base: "/manual/js"})
        .pipe(
            cheerio({
                run: $ => {

                    Object.keys(CODE).forEach(code => {

                        if (fs.existsSync(path.resolve(CODE[code]))) {

                            $("." + code).removeAttr("hidden");

                        } else {

                            $("." + code).attr("hidden", "");
                        }
                    });

                },
                parserOptions: {
                    normalizeWhitespace: false,
                    decodeEntities: false
                }
            })
        )
        .pipe(gulp.dest("/manual"));
});
