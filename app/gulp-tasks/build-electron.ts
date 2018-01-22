import * as gulp from 'gulp';
import * as typescript from 'gulp-typescript';

function buildElectron() {
  return gulp.src('src/electron/**/*.ts')
    .pipe(typescript())
    .pipe(gulp.dest('dist/'));
}

export = buildElectron;
