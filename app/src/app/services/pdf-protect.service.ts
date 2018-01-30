import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
const { isPdfDocument } = window.require('protego-pdf-helper');

@Injectable()
export class PdfProtectService {
  public pdfDocument(file: string): Observable<boolean> {
    return fromPromise(isPdfDocument(file));
  }
}
