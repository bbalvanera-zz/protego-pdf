/**
 * Copyright (C) 2018 Bernardo Balvanera
 *
 * This file is part of ProtegoPdf.
 *
 * ProtegoPdf is a free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const gulp = require('gulp');

const lint = require('./gulp-tasks/lint');
const cleanDist = require('./gulp-tasks/clean-dist');
const buildPug = require('./gulp-tasks/build-pug');
const buildAngular = require('./gulp-tasks/build-angular');
const buildElectron = require('./gulp-tasks/build-electron');
const runElectron = require('./gulp-tasks/run-electron');
const publishing = require('./gulp-tasks/publishing');
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
gulp.task('run', runElectron);

gulp.task('watch',
  gulp.parallel(
    buildAngular,
    watchPug,
    watchElectron
  )
);

function setProd(done) {
  process.env.PROD = true;
  done();
}

gulp.task('publish',
  gulp.series(
    setProd,
    cleanDist,
    buildPug,
    lint,
    buildAngular,
    buildElectron,
    publishing
  )
);

gulp.task(publishing);
