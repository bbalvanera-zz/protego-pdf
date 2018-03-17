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

function executeCall<T>(name: string, options: PdfOptions): Promise<T> {
  const pdfHelper = getPdfHelper();
  const request = {
    name,
    options
  };

  return new Promise<T>((resolve, reject) => {
    pdfHelper.stdout.once('data', (data: Buffer) => {
      const raw = data.toString('utf8');
      const response = JSON.parse(raw) as OperationResult<T>;

      response.success
        ? resolve(response.result)
        : reject({
          errorType: response.errorType,
          errorDescription: response.errorDescription,
        });
    });

    pdfHelper.stderr.once('data', (data: Buffer) => {
      reject(data.toString('utf8'));
    });

    pdfHelper.stdin.write(JSON.stringify(request) + '\n');
  });
}

function getPdfHelper(): ChildProcess {
  const helperPath = path.resolve(__dirname, '../bin/pdfhelper.exe');
  return spawn(helperPath);
}

export const protegoPdfProxy = {
  executeCall
};
