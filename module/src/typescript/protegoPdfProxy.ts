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
