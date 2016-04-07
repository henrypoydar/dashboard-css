'use strict';

var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var cleancss = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var header = require('gulp-header');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');

var sources = {
  scss: "./src/*.scss",
  html: "./demo/*.html"
};

var targets = {
  dist: "./dist",
  css: "./demo/css",
  scss: "./src",
  server: "./demo"
};

var pkg = require('./package.json');
var banner = ['/*!',
  ' * Dashboard CSS v<%= pkg.version %>',
  ' * <%= pkg.homepage %>',
  ' *',
  ' * Copyright (c) <%= pkg.author %>',
  ' * Licensed under the <%= pkg.license %> license',
  '*/',
  '', ''].join('\n');

gulp.task('sass', function () {
  return gulp.src(sources.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest(targets.css))
    .pipe(gulp.dest(targets.dist))
    .pipe(cleancss())
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(targets.css))
    .pipe(gulp.dest(targets.dist))
    .pipe(browserSync.stream());
});

gulp.task('comb', function() {
  return gulp.src(sources.scss)
    .pipe(csscomb())
    .pipe(gulp.dest(targets.scss));
});

gulp.task('lint', function() {
  return gulp.src(sources.scss)
    .pipe(scsslint())
    .pipe(scsslint.failReporter('E'))
});

gulp.task('publish', shell.task([
  'git co gh-pages',
  'git merge master',
  'git co master'
]));

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: targets.server
  });
  gulp.watch(sources.scss, ['sass']);
  gulp.watch(sources.html).on('change', browserSync.reload);
  return;
});

gulp.task('build', ['comb', 'lint', 'sass']);
gulp.task('test', ['build']);

gulp.task('default', ['test']);
