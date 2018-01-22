import * as gulp from 'gulp';
import buildElectron = require('./build-electron');

function watchElectron() {
  return gulp.watch('src/electron/**/*.ts', gulp.parallel(buildElectron));
}

export = watchElectron;
