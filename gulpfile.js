const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const webpack = require("webpack-stream");
const order = require("gulp-order");
const concat = require("gulp-concat");
const clean = require("gulp-clean-css");

// Criação do server para dev

function server() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

exports.server = server;

//  -------------

// Criação do style.css a partir do .scss

const sassOptions = {
  outputStyle: "compressed",
};

function buildSCSS() {
  return gulp
    .src("./sass/*.scss")
    .pipe(sass(sassOptions))
    .pipe(
      gulp.dest("./css/").on("end", (err, res) => {
        if (err) {
          console.log(err);
          throw err;
        } else {
          return gulp
            .src("./css/style.css")
            .pipe(autoprefixer())
            .pipe(gulp.dest("./css/"))
            .pipe(browserSync.stream());
        }
      })
    );
}

//  Criação do CSS a partir de CSS
function buildCSS() {
  return gulp
    .src("./css/modules/*.css")
    .pipe(order(["styles.css", "media.css"]))
    .pipe(concat("style.min.css"))
    .pipe(clean())
    .pipe(autoprefixer())
    .pipe(gulp.dest("./css/"))
    .pipe(browserSync.stream());
}

// webpack compilação e transpilação

function bundleJS() {
  return gulp
    .src("./js/modules/script.js")
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("./js/"))
    .pipe(browserSync.stream());
}

async function buildPage() {
  const html = gulp.src("*.html").pipe(gulp.dest("./dist"));
  const styles = gulp.src("./css/style.min.css").pipe(gulp.dest("./dist/css/"));
  const js = gulp.src("./js/main.js").pipe(gulp.dest("./dist/js/"));
  const assets = gulp.src("./assets/**/*").pipe(gulp.dest("./dist/assets/"));
  return [html, styles, js, assets];
}

// Listener para mudanças nos arquivos

function watchers() {
  gulp.watch("./*.html").on("change", browserSync.reload);
  gulp.watch("./sass/*.scss", buildSCSS);
  gulp.watch("./js/modules/*.js", bundleJS);
  gulp.watch("./css/modules/*.css", buildCSS);
}

// tasks
exports.buildJS = bundleJS;
exports.buildSCSS = buildSCSS;
exports.buildCSS = buildCSS;
exports.buildPage = buildPage;

// default gulp
exports.default = gulp.parallel(server, watchers);
