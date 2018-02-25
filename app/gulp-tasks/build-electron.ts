import * as fs from 'fs';
import * as typescript from 'gulp-typescript';
import * as gulp from 'gulp';

function buildElectron() {
  return gulp.src('src/electron/**/*.ts')
      .pipe(typescript())
      .pipe(gulp.dest('dist/'));
}

export = buildElectron;
