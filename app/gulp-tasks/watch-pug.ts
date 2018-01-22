import * as gulp from 'gulp';
import buildPug = require('./build-pug');

function watchPug() {
  return gulp.watch('src/**/*.pug', gulp.parallel(buildPug));
}

export = watchPug;
