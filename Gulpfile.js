import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __dirname = import.meta.dirname;

var integrations = require("./integrations.cjs");
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
var { createHash } = require("node:crypto");
/**
* @see https://www.npmjs.com/package/gulp-nunjucks
*/
import { nunjucksCompile } from "gulp-nunjucks";
import nunjucks from "nunjucks";

const TEMPLATE_ROOT = "./templates/**/*.html";
const TEMPLATE_PREPROCESS_SRC = "./templates/site/index.html";
const TEMPLATE_PREPROCESS_DEST = "./";

const SASS_SRC = "./scss/**/*.scss";
const SASS_DEST = "./css";

const SASS_MQ_INCLUDE_PATH = "./node_modules/sass-mq/_mq.scss";

const isLive = mode.gulpModeLive();

const SITE_VERSION = 'alpha-0.2';

const IMPORT_MAP = `{
    "imports": {
        "site-utils": "./scripts/site/module/site-utils.js",
        "callback-oscillator-node": "./scripts/site/module/callback-oscillator-node.js",
        "callback-metronome": "./scripts/site/module/callback-metronome.js",
        "combination-generator": "./scripts/site/module/combination-generator.js",
        "petite-vue-pro": "./scripts/vendor/petite-vue-pro@0.4.6.js",
        "component.generate-grid-form": "./scripts/site/petite-vue/component.generate-grid-form.js",
        "component.metronome-form": "./scripts/site/petite-vue/component.metronome-form.js",
        "component.autoscroll-form": "./scripts/site/petite-vue/component.autoscroll-form.js",
        "component.view-options-form": "./scripts/site/petite-vue/component.view-options-form.js",
        "component.control-panel": "./scripts/site/petite-vue/component.control-panel.js",
        "component.side-menu": "./scripts/site/petite-vue/component.side-menu.js",
        "component.render-area": "./scripts/site/petite-vue/component.render-area.js",
        "component.consent-banner": "./scripts/site/petite-vue/component.consent-banner.js",
        "page-manager": "./scripts/site/petite-vue/page-manager.js"
    }
}`;

const IMPORT_MAP_HASH = createHash('sha256').update(IMPORT_MAP).digest('base64');

gulp.task("html", function() {
    return gulp.src(TEMPLATE_PREPROCESS_SRC)
                .pipe(nunjucksCompile(
                    // data
                    Object.assign((isLive ? integrations.LIVE : integrations.DEV), {
                        'importMap': IMPORT_MAP,
                        'importMapHash': IMPORT_MAP_HASH,
                        'siteVersion': SITE_VERSION
                    }),
                    // set a new Environment to make sure the root dir of the templates is properly set.
                    {
                        env: nunjucks.configure(__dirname + "/templates", {
                            autoescape: false,
                            tags: {
                                variableStart: '{$',
                                variableEnd: '$}'
                            }
                        })
                    }
                ))
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

export default gulp.series("html", "sass", gulp.parallel("watch-html", "watch-sass"));
