import { TaskFunction } from 'gulp';
import { exec } from 'child_process';
import { setTimeout } from 'timers';

function buildAngular(done: TaskFunction) {
  exec('ng build -w');
  done();
}

export = buildAngular;
