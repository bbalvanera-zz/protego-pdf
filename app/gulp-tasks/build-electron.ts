import * as fs from 'fs';
import * as typescript from 'gulp-typescript';
import * as gulp from 'gulp';

import { setTimeout } from 'timers';

function buildElectron(): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    build(resolve, reject);
  });
}

function build(resolve: Function, reject: Function): void {
  if (!fs.existsSync('dist/')) {
    setTimeout(build, 2000, resolve, reject);
    return;
  }

  gulp.src('src/electron/**/*.ts')
      .pipe(typescript())
      .on('error', reject)
      .pipe(gulp.dest('dist/'))
      .on('end', resolve);
}

export = buildElectron;
