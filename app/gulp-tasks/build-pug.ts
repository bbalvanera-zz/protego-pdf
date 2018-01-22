import * as gulp from 'gulp';
import * as pug from 'gulp-pug';

function buildPug() {
  return gulp.src('src/**/*.pug')
    .pipe(pug({
      doctype: 'html',
      pretty: true
    }))
    .pipe(gulp.dest('src'));
}

export = buildPug;
