import { TaskFunction } from 'gulp';
import { fork } from 'child_process';
import * as fs from 'fs';

// this task depends on the ./dist folder being deleted before running this class.

function buildAngular(done: TaskFunction): void {
  try {
    const process = "./node_modules/@angular/cli/bin/ng"
    const ng = fork(process, ['build', '-w']);
  } catch(error) {
    console.log(error);
  }

  monitorNgFinish(done);
}

function monitorNgFinish(done: TaskFunction): void {
  // consider ng task finished when the dist folder is created
  if (!fs.existsSync('dist/')) {
    setTimeout(monitorNgFinish, 2000, done);
    return;
  }

  done();
}

export = buildAngular;
