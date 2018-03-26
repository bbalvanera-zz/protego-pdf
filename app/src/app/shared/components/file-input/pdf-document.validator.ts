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

import { InjectionToken, Provider } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { PdfProtectService } from '../../../services/pdf-protect.service';

const fs = window.require('fs');

export const PDF_DOCUMENT_VALIDATOR = new InjectionToken<string>('pdfDocumentValidation');

export const pdfDocumentValidatorProvider: Provider = {
  provide: PDF_DOCUMENT_VALIDATOR,
  useFactory: pdfDocumentValidator,
  deps: [PdfProtectService]
};

let timeout: NodeJS.Timer;

export function pdfDocumentValidator(pdfService: PdfProtectService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;

    if (!value || value.length === 0) {
      return observableOf(null);
    }

    if (!fs.existsSync(value)) {
      return observableOf(null);
    }

    // Use debounce as per https://github.com/angular/angular/issues/21500
    clearTimeout(timeout);
    return Observable.create(observer => {
      timeout = setTimeout(() => {
        timeout = null;

        pdfService.isPdfDocument(value)
        .pipe(
          map((isPdf: boolean): ValidationErrors | null => isPdf ? null : { notAPdfDocument : true }),
          catchError(err => errorHandler(err))
        ).subscribe(observer);
      }, 50);
    });
  };
}

function errorHandler(err: { errorType: string }): Observable<ValidationErrors> {
  let validationErrors: ValidationErrors = { generalError: true };

  if (err && err.errorType) {
    switch (err.errorType) {
      case 'File_Access_Error':
        validationErrors = { fileAccessError: true };
        break;
      case 'Insufficient_Permissions':
        validationErrors = { insufficientPermissions: true };
        break;
      default:
        validationErrors = { generalError: true };
        break;
    }
  }

  return observableOf(validationErrors);
}
