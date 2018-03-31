import * as gulp from 'gulp';
import * as install from 'gulp-install';

function publishing(done) {
  return gulp.src(['./dist/**/*', 'LICENSE'])
    .pipe(gulp.dest('../publish'))
    .pipe(install());
}

export = publishing;
