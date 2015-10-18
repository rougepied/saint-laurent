'use-strict';

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
    return gulp.src('src/index.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            inlineScripts: true,
            inlineCss: true
        }))
        .pipe(crisper({
            scriptInHead: true,
            onlySplit: false
        }))
        .pipe(gulpif(/\.js$/, uglify()))
        .pipe(gulp.dest('public'));
});
