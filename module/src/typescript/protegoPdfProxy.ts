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

import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { PdfOptions } from './pdfOptions';
import { OperationResult } from './operationResult';

let pdfHelper: ChildProcess;
let internalResolve: (value?: any | PromiseLike<any>) => void = () => void 0;
let internalReject: (reason?: any) => void = () => void 0;

(function init(): void {
  const helperPath = path.resolve(__dirname, '../bin/pdfhelper.exe');
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

function executeCall<T>(name: string, options: PdfOptions): Promise<T> {
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

export const protegoPdfProxy = {
  executeCall
};
