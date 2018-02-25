const gulp = require('gulp');
const exec = require('child_process').exec;

const lint = require('./gulp-tasks/lint');
const cleanDist = require('./gulp-tasks/clean-dist');
const buildPug = require('./gulp-tasks/build-pug');
const buildAngular = require('./gulp-tasks/build-angular');
const buildElectron = require('./gulp-tasks/build-electron');
const runElectron = require('./gulp-tasks/run-electron');
const watchPug = require('./gulp-tasks/watch-pug');
const watchElectron = require('./gulp-tasks/watch-electron');

gulp.task('serve',
  gulp.parallel(
    gulp.series(
      cleanDist,
      buildPug,
      lint,
      buildAngular,
      buildElectron,
      runElectron
    ),
    watchPug,
    watchElectron
  )
);

gulp.task(lint);
gulp.task('angular', buildAngular);
gulp.task('pug', buildPug);
gulp.task('electron', buildElectron);

gulp.task('watch',
  gulp.parallel(
    buildAngular,
    watchPug,
    watchElectron
  )
);
