var integrations = require("./integrations.js");
var gulp = require("gulp");
/**
* @see https://github.com/pioug/gulp-preprocess
*/
var preprocess = require("gulp-preprocess");
var sass = require("gulp-dart-sass");
/**
* @see https://www.npmjs.com/package/gulp-mode
*/
var mode = require("gulp-mode")({
    modes: ["gulpModeLive", "gulpModeDev"],
    default: "gulpModeDev",
    verbose: false
});

const TEMPLATE_ROOT = "./templates/**/*.html";
const TEMPLATE_PREPROCESS_SRC = "./templates/site/index.html";
const TEMPLATE_PREPROCESS_DEST = "./";

const SASS_SRC = "./scss/**/*.scss";
const SASS_DEST = "./css";

const SASS_MQ_INCLUDE_PATH = "./node_modules/sass-mq/_mq.scss";

const isLive = mode.gulpModeLive();

gulp.task("html", function() {
    return gulp.src(TEMPLATE_PREPROCESS_SRC)
                .pipe(preprocess({
                    context: (isLive ? integrations.LIVE : integrations.DEV)
                }))
                .pipe(gulp.dest(TEMPLATE_PREPROCESS_DEST));
});

gulp.task("watch-html", function() {
    return gulp.watch(TEMPLATE_ROOT, gulp.series("html"));
});

gulp.task("sass", function() {
    return gulp.src(SASS_SRC)
                .pipe(sass({
                    includePaths: [SASS_MQ_INCLUDE_PATH]
                }).on('error', sass.logError))
                .pipe(gulp.dest(SASS_DEST));
});

gulp.task("watch-sass", function() {
    return gulp.watch(SASS_SRC, gulp.series("sass"));
});

exports.default = gulp.series("html", "sass", gulp.parallel("watch-html", "watch-sass"));
