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

import { TaskFunction } from 'gulp';
import { fork } from 'child_process';
import { setTimeout } from 'timers';
import * as fs from 'fs';
// this task depends on the ./dist folder being deleted before running this class.
import { isProd } from './is-prod';

function buildAngular(done: TaskFunction): void {
  try {

    const ngLocation = "./node_modules/@angular/cli/bin/ng";
    const args = ['build', `${isProd() ? '--prod' : '-w'}`];
    const ng = fork(ngLocation, args);

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
