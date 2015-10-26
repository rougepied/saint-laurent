'use-strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

var $ = gulpLoadPlugins();

gulp.task('build', () => {
  return gulp.src('src/index.html', {
      base: "./src"
    })
    .pipe($.plumber())
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
      // compact: false,
      blacklist: ['useStrict']
    })))
    .on("error", console.log)
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

gulp.task('default', ['build']);

gulp.task('watch', () => {
  gulp.watch('src/**/*', ['build']);
});
