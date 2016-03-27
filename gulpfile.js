'use strict';

var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var header = require('gulp-header');
var cleancss = require('gulp-clean-css');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

var sources = {
  sass: "./src/*.scss",
  html: "./demo/*.html"
};

var targets = {
  dist: "./dist",
  css: "./demo/css",
  server: "./demo"
};

var pkg = require('./package.json');
var banner = ['/*!',
  ' * Dashboard CSS v<%= pkg.version %>',
  ' * <%= pkg.homepage %>',
  ' *',
  ' * Copyright (c) Henry Poydar',
  ' * Licensed under the MIT license',
  '*/',
  '', ''].join('\n');

gulp.task('sass', function () {
  gulp.src(sources.sass)
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
    .pipe(gulp.dest(targets.dist));
});

gulp.task('serve', function() {
  browserSync.init({
    server: targets.server
  });
  gulp.watch(sources.sass, ['sass']);
  gulp.watch(sources.html).on('change', browserSync.reload);
});

gulp.task('build', ['sass']);

gulp.task('default', ['build']);
