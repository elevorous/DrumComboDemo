/**
* https://github.com/pioug/gulp-preprocess
*/
var gulp = require("gulp");
var preprocess = require("gulp-preprocess");

const TEMPLATE_ROOT = "./templates/**/*.html";
const TEMPLATE_PREPROCESS_SRC = "./templates/site/index.html";
const TEMPLATE_PREPROCESS_DEST = "./";

gulp.task("html", function() {
  return gulp.src(TEMPLATE_PREPROCESS_SRC)
                .pipe(preprocess())
                .pipe(gulp.dest(TEMPLATE_PREPROCESS_DEST));
});

gulp.task("watch-html", function() {
    return gulp.watch(TEMPLATE_ROOT, gulp.series("html"));
});

exports.default = gulp.series("html", "watch-html");
