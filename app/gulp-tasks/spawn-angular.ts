import { TaskFunction } from 'gulp';
import { fork } from 'child_process';

function spawnAngular(done: TaskFunction) {
  try {
    const process = "./node_modules/@angular/cli/bin/ng"
    const ng = fork(process, ['build', '-w']);
  } catch(error) {
    console.log(error);
  }

  done();
}

export = spawnAngular;
