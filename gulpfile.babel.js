'use-strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

var $ = gulpLoadPlugins();

gulp.task('default', () => {
  return gulp
    .src('src/index.html', {
      base: "./src"
    })
    .pipe($.vulcanize({
      inlineScripts: true,
      // inlineCss: true,
      stripComments: true,
    }))
    .pipe($.if('*.html', $.crisper({
      scriptInHead: true,
      onlySplit: false
    })))
    .pipe($.if('*.js', $.babel({
      blacklist: ['useStrict']
    })))
    .pipe($.if('*.js', $.uglify({
      mangle: false
    })))
    .pipe($.if('*.html', $.minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    .pipe(gulp.dest('public'));
});
