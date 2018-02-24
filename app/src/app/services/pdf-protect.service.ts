import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map } from 'rxjs/operators/map';

import { PdfProtectionOptions } from 'protego-pdf-helper';

const { isPdfDocument, protect } = window.require('protego-pdf-helper');

@Injectable()
export class PdfProtectService {
  public pdfDocument(file: string): Observable<boolean> {
    return fromPromise(isPdfDocument(file));
  }

  public protect(source: string, target: string, password: string, options?: PdfProtectionOptions): Observable<boolean> {
    return fromPromise<boolean>(protect(source, target, password, options || {}));
  }
}
