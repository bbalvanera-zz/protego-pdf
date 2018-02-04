import { exec } from 'child_process';
import * as gulp from 'gulp';

function runElectron(done: gulp.TaskFunction) {
  exec('electron ./dist/app.js --debug');
  done();
}

export = runElectron;
