"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var runSequence = require("run-sequence");

gulp.task("style", function () {
  gulp.src("assets/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("dist/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(server.stream());
});

gulp.task("scripts", function () {
    return gulp.src("assets/**/*.js")
        .pipe(gulp.dest("dist"));
});

gulp.task("serve", ["style"], function () {
  server.init({
    server: "dist/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("assets/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("assets/js/**/*.js", ["scripts", server.reload]);
  gulp.watch("assets/*.html", ["html", server.reload]);

});

gulp.task("images", function () {
  return gulp.src("assets/images/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("dist/images"));
});

gulp.task("sprite", function () {
  return gulp.src("assets/images/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("dist/images"));
});

gulp.task("html", function () {
  return gulp.src("assets/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("dist"));
});

gulp.task("copy", function () {
  return gulp.src([
    "assets/fonts/**/*.{woff,woff2}",
    "assets/images/**",
    "assets/js/**",
    "assets/libs/**"
  ], {
    base: "assets"
  })
    .pipe(gulp.dest("dist"));
});

gulp.task("clean", function () {
  return del("dist");
});

gulp.task("build", function (callback) {
  runSequence('clean', [
    'copy',
    'style',
    'scripts',
    'sprite',
    'html',
  ], callback);
});
