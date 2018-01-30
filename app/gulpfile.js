const gulp = require('gulp');
const exec = require('child_process').exec;

const lint = require('./gulp-tasks/lint');
const buildPug = require('./gulp-tasks/build-pug');
const buildAngular = require('./gulp-tasks/build-angular');
const buildElectron = require('./gulp-tasks/build-electron');
const watchPug = require('./gulp-tasks/watch-pug');
const watchElectron = require('./gulp-tasks/watch-electron');


gulp.task('serve',
  gulp.series(
    buildPug,
    lint,
    gulp.parallel(
      buildElectron,
      watchPug,
      watchElectron
    )
  )
);

gulp.task(lint);
gulp.task(buildPug);
gulp.task(buildElectron);

gulp.task('watch',
  gulp.parallel(
    watchPug,
    watchElectron
  )
);
