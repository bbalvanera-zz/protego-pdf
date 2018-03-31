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

import { HelperOptions } from './helper-options';
import { OperationResult } from './operation-result';
import { ChildProcess } from 'child_process';

import { environment } from '../../environments/environment';

const path = window.require('path');
const { spawn } = window.require('child_process');

let pdfHelper: ChildProcess;

let internalResolve: (value?: any | PromiseLike<any>) => void = () => void 0;
let internalReject: (reason?: any) => void = () => void 0;

(function init(): void {
  const extras = environment.production ? '../extras' : 'extras'; // extras have diff path in prod than in dev
  const helperPath = path.resolve(window.__dirname, extras, 'helper/pdfhelper.exe');

  pdfHelper = spawn(helperPath);

  pdfHelper.stdout.on('data', (data: Buffer) => {
    const raw = data.toString('utf8');
    const response = JSON.parse(raw) as OperationResult<any>;

    response.success
      ? internalResolve(response.result)
      : internalReject({
        errorType: response.errorType,
        errorDescription: response.errorDescription,
      });
  });

  pdfHelper.stderr.once('data', (data: Buffer) => {
    internalReject(data.toString('utf8'));
  });
})();

export class Proxy {
  public static executeCall<T>(name: string, options: HelperOptions): Promise<T> {
    const request = {
      name,
      options
    };

    const retVal = new Promise<T>((resolve, reject) => {
      internalResolve = resolve;
      internalReject = reject;
    });

    pdfHelper.stdin.write(JSON.stringify(request) + '\n');

    return retVal;
  }
}
