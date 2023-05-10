import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);
import postcss from 'gulp-postcss';
import csso from "postcss-csso";
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from "gulp-htmlmin";
import svgo from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import { deleteAsync } from "del";
import { htmlValidator } from "gulp-w3c-html-validator";
import rename from "gulp-rename";

// Styles

export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// HTML

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

export const validator = () => {
  return gulp
    .src("build/*.html")
    .pipe(htmlValidator.analyzer())
    .pipe(htmlValidator.reporter());
}

const svg = () =>
  gulp
    .src("source/img/*.svg")
    .pipe(svgo())
    .pipe(gulp.dest("build/img"));

const sprite = () => {
  return gulp
    .src("source/img/sprite/*.svg")
    .pipe(svgo())
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

// Clean

const reset = () => {
  return deleteAsync("build");
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Reload

const reload = (done) => {
  browser.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/img/sprite/*.svg", gulp.series(sprite, reload));
  gulp.watch("source/img/*.svg", gulp.series(svg, reload));
}


// Build

export const build = gulp.series(
  reset,
  gulp.parallel(styles, html, svg, sprite),
  gulp.series(server, watcher)
);

// Default

export default gulp.series(
  reset,
  gulp.parallel(styles, html, svg, sprite),
  gulp.series(server, watcher)
);
