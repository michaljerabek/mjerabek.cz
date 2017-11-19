/*jslint indent: 4, white: true, nomen: true, unparam: true, node: true, browser: true, devel: true, plusplus: true, regexp: true, sloppy: true, vars: true, esversion: 6 */

//npm install gulp gulp-rename gulp-concat gulp-clean-css gulp-rewrite-css gulp-cssimport critical gulp-uglify gulp-imagemin imagemin-mozjpeg gulp-svg-sprite

let requireModule = (moduleName) => { try { return require(moduleName); } catch (e) { return function () {}; } };

const fs = require("fs");
const path = require("path");

const gulp = requireModule("gulp");
const rename = requireModule("gulp-rename");

const PATHS = {
    CSS: "css",
    CSS_COMPONENTS: "css/components/*",
    CSS_OUTPUT_DIR: "css",
    CSS_OUTPUT: "all$1",
    CSS_OUTPUT_MIN: "all$1.min",
    CSS_IMPORT_DIR: "css",
    CSS_IMPORT: /^import(.*)\.css$/i,
    CSS_IMPORT_GULP_STR: "css/import*.css",

    CRITICAL_OUTPUT: "critical",

    JS: "js",
    JS_BUILD: "js/build.json",
    JS_MODULES: "js/modules/*",
    JS_OUTPUT_DIR: "js",
    JS_OUTPUT: "all{{postfix}}",
    JS_OUTPUT_MIN: "all{{postfix}}.min",
    JS_OUTPUT_INIT: "all-init{{postfix}}",
    JS_OUTPUT_INIT_MIN: "all-init{{postfix}}.min",
    JS_INIT: "js/init{{postfix}}.js",
    JS_INIT_GULP_STR: "js/init*.js",
    JS_INIT_DIR: "js",

    LIBS: "libs",
    LIBS_BUILD: "libs/build.json",
    LIBS_CSS_OUTPUT: "libs{{postfix}}.min.css",
    LIBS_JS_OUTPUT: "libs{{postfix}}.min.js",

    HTML: process.cwd(),

    IMG_INPUT: "img/src",
    IMG_OUTPUT: "img",
    SVG_OUTPUT: "img/svg-sprite",
    SVG_INPUT: "img/svg-sprite/src"
};


gulp.task("watch", () => {

    gulp.watch([
        path.resolve(PATHS.CSS_COMPONENTS),
        path.resolve(PATHS.CSS_IMPORT_GULP_STR)
    ], ["css"]);

    gulp.watch([
        path.resolve(PATHS.JS_MODULES),
        path.resolve(PATHS.JS_BUILD)
    ], ["js"]);

    gulp.watch([
        path.resolve(PATHS.JS_OUTPUT_DIR, `${PATHS.JS_OUTPUT}.js`),
        path.resolve(PATHS.JS_INIT_GULP_STR),
        path.resolve(PATHS.JS_BUILD)
    ], ["js-init"]);

    gulp.watch(path.resolve(PATHS.LIBS_BUILD), ["libs"]);
});

/* -------------------- CSS -------------------- */

//npm install gulp gulp-rename gulp-clean-css gulp-cssimport gulp-rewrite-css

const cleanCSS = requireModule("gulp-clean-css");
const rewriteCSS = requireModule("gulp-rewrite-css");
const CSSimport = requireModule("gulp-cssimport");

gulp.task("css", () => {

    let files = fs.readdirSync(path.resolve(PATHS.CSS_IMPORT_DIR)),

        imports = files.filter(file => file.match(PATHS.CSS_IMPORT));

    imports.forEach(file => {

        gulp.src(path.resolve(PATHS.CSS_IMPORT_DIR, file))
            .pipe(CSSimport())
            .pipe(rewriteCSS({
                destination: "./"
            }))
            .pipe(rename(path => path.basename = file.replace(PATHS.CSS_IMPORT, PATHS.CSS_OUTPUT)))
            .pipe(
                gulp.dest(path.resolve(PATHS.CSS_OUTPUT_DIR))
            )
            .pipe(cleanCSS({
                compatibility: "ie8,-properties.zeroUnits"
            }))
            .pipe(rename(path => path.basename = file.replace(PATHS.CSS_IMPORT, PATHS.CSS_OUTPUT_MIN)))
            .pipe(
                gulp.dest(path.resolve(PATHS.CSS_OUTPUT_DIR))
            );
    });
});

/* -------------------- JS -------------------- */

//npm install gulp gulp-rename gulp-uglify gulp-concat

const uglify = requireModule("gulp-uglify");
const concat = requireModule("gulp-concat");

gulp.task("js", () => {

    let builds = fs.readFileSync(path.resolve(PATHS.JS_BUILD)),

        buildsData = JSON.parse(builds);

    buildsData = buildsData instanceof Array ? buildsData : [buildsData];

    buildsData.forEach(build => {

        let modules = build.modules.map(file => path.resolve(PATHS.JS_MODULES.replace("*", ""), file)),

            fileName = PATHS.JS_OUTPUT.replace("{{postfix}}", build.postfix || ""),
            minFileName = PATHS.JS_OUTPUT_MIN.replace("{{postfix}}", build.postfix || "");

        gulp.src(modules)
            .pipe(concat(`${fileName}.js`))
            .pipe(
                gulp.dest(path.resolve(PATHS.JS_OUTPUT_DIR))
            )
            .pipe(uglify())
            .pipe(rename(path => path.basename = minFileName))
            .pipe(
                gulp.dest(path.resolve(PATHS.JS_OUTPUT_DIR))
            );
    });
});

gulp.task("js-init", () => {

    let builds = fs.readFileSync(path.resolve(PATHS.JS_BUILD)),

        buildsData = JSON.parse(builds);

    buildsData = buildsData instanceof Array ? buildsData : [buildsData];

    buildsData.forEach(build => {

        let inputInit = PATHS.JS_INIT.replace("{{postfix}}", build.postfix || ""),
            allFileName = PATHS.JS_OUTPUT.replace("{{postfix}}", build.postfix || ""),
            initFileName = PATHS.JS_OUTPUT_INIT.replace("{{postfix}}", build.postfix || ""),
            minInitFileName = PATHS.JS_OUTPUT_INIT_MIN.replace("{{postfix}}", build.postfix || "");

        gulp.src([
                path.resolve(PATHS.JS_OUTPUT_DIR, `${allFileName}.js`),
                path.resolve(inputInit)
            ])
            .pipe(concat(`${initFileName}.js`))
            .pipe(
                gulp.dest(path.resolve(PATHS.JS_OUTPUT_DIR))
            )
            .pipe(uglify())
            .pipe(rename(path => path.basename = minInitFileName))
            .pipe(
                gulp.dest(path.resolve(PATHS.JS_OUTPUT_DIR))
            );
    });
});

/* -------------------- LIBS -------------------- */

//npm install gulp gulp-uglify gulp-concat gulp-clean-css gulp-rewrite-css

gulp.task("libs", () => {

    let builds = fs.readFileSync(path.resolve(PATHS.LIBS_BUILD)),

        buildsData = JSON.parse(builds);

    buildsData = buildsData instanceof Array ? buildsData : [buildsData];

    buildsData.forEach(build => {

        let jsFiles = build.js.map(file => path.resolve(PATHS.LIBS, file)),
            cssFiles = build.css.map(file => path.resolve(PATHS.LIBS, file)),

            jsFileName = PATHS.LIBS_JS_OUTPUT.replace("{{postfix}}", build.postfix || ""),
            cssFileName = PATHS.LIBS_CSS_OUTPUT.replace("{{postfix}}", build.postfix || ""),

            jsOutPath = path.resolve(PATHS.JS_OUTPUT_DIR, jsFileName),
            cssOutPath = path.resolve(PATHS.CSS_OUTPUT_DIR, cssFileName);

        if (!jsFiles.length && fs.existsSync(jsOutPath)) {

            fs.unlinkSync(jsOutPath);
        }

        if (!cssFiles.length && fs.existsSync(cssOutPath)) {

            fs.unlinkSync(cssOutPath);
        }

        gulp.src(jsFiles)
            .pipe(concat(jsFileName))
            .pipe(uglify())
            .pipe(
                gulp.dest(path.resolve(PATHS.JS_OUTPUT_DIR))
            );

        gulp.src(cssFiles)
            .pipe(concat(cssFileName))
            .pipe(cleanCSS())
            .pipe(rewriteCSS({
                destination: PATHS.CSS_OUTPUT_DIR
            }))
            .pipe(
                gulp.dest(path.resolve(PATHS.CSS_OUTPUT_DIR))
            );
    });
});

/* -------------------- CRITICAL CSS -------------------- */

//npm install gulp critical

const critical = requireModule("critical");

const WIDTH = 1024,
    HEIGHT = 1024;

gulp.task("critical", () => {

    if (!fs.existsSync(PATHS.CRITICAL_OUTPUT)) {

        fs.mkdirSync(PATHS.CRITICAL_OUTPUT);
    }

    let pages = (function () {

        let files = fs.readdirSync(PATHS.HTML);

        return files.filter(file => file.match(/.html$/));

    }());

    pages.forEach(page => {

        critical.generate({
            dest: `${PATHS.CRITICAL_OUTPUT}/${page}`,
            inline: true,
            src: page,
            minify: true,
            width: WIDTH,
            height: HEIGHT
        });

        critical.generate({
            dest: `${PATHS.CRITICAL_OUTPUT}/${page}.min.css`,
            inline: false,
            src: page,
            minify: true,
            width: WIDTH,
            height: HEIGHT
        });
    });
});

/* -------------------- IMAGES OPT. -------------------- */

//npm install gulp gulp-imagemin imagemin-mozjpeg

const imagemin = requireModule("gulp-imagemin");
const imageminMozjpeg = requireModule("imagemin-mozjpeg");

const JPEG_QUALITY = 75;

gulp.task("images", () => {

    gulp.src([
            `${PATHS.IMG_INPUT}/*.{png,jpg,gif,svg}`,
            `${PATHS.IMG_INPUT}/**/*.{png,jpg,gif,svg}`
        ])
        .pipe(imagemin([
            imagemin.svgo(),
            imagemin.gifsicle(),
            imageminMozjpeg({
                quality: JPEG_QUALITY,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
        ]))
        .pipe(
            gulp.dest(path.resolve(PATHS.IMG_OUTPUT))
        );
});

/* -------------------- SVG SPRITE -------------------- */

//npm install gulp gulp-svg-sprite

const svgSprite = requireModule("gulp-svg-sprite");

gulp.task("svg", () => {

    gulp.src(`${PATHS.SVG_INPUT}/*.svg`)
        .pipe(svgSprite({
            shape: {
                spacing: {
                    padding: 0
                },
                id: {
                    generator: "icon-%s"
                }
            },
            mode: {
                symbol: true,
                view: {
                    bust: false
                }
            },
            svg: {
                xmlDeclaration: false,
                doctypeDeclaration: false,
                namespaceIDs: true,
                dimensionAttributes: true,
                rootAttributes: {
                    style: "display: none;"
                }
            }
        }))
        .pipe(gulp.dest(PATHS.SVG_OUTPUT));
});
