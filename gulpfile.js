import gulp from 'gulp';
import plumber from 'gulp-plumber';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);
import postcss from 'gulp-postcss';
import csso from "postcss-csso";
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import { deleteAsync } from "del";
import rename from "gulp-rename";

// Styles

export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    // .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "source",
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
  gulp.watch("source/*.html", gulp.series(reload));
}


// Default

export default gulp.series(
  gulp.parallel(styles),
  gulp.series(server, watcher)
);
