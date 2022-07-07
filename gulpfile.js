/* initialize modules */
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

/* use dart-css for @use new syntax from sass */
sass.compiler = require("dart-sass");

/* sass task */
function scssTask() {
  return src("app/scss/app.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

/* js task */
function jsTask() {
  return src("app/js/app.js", { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
}

/* browsersync task */
function browsersyncTask(callbacks) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  callbacks();
}
function browsersyncReload(callbacks) {
  browsersync.reload();
  callbacks();
}

/* watch task */
function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["app/scss/**/*.scss", "app/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

/* default gulp task */
exports.default = series(scssTask, jsTask, browsersyncTask, watchTask);
