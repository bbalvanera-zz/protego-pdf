import * as gulp from 'gulp';
import * as pug from 'gulp-pug';
import * as plumber from 'gulp-plumber';

function buildPug() {
  return gulp.src('src/**/*.pug')
    .pipe(plumber(function (error) {
       console.log(error.message);
    }))
    .pipe(pug({
      doctype: 'html',
      pretty: true
    }))
    .pipe(gulp.dest('src'));
}

export = buildPug;
