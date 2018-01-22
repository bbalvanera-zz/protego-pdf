import * as gulp from 'gulp';
import tslint from 'gulp-tslint';

function lint() {
  return gulp.src(['src/**/*.ts', '!src/**/*.d.ts'])
    .pipe(tslint({ formatter: "verbose" }))
    .pipe(tslint.report());
}

export = lint;
