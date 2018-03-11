import { InjectionToken, Provider } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import * as utils from 'underscore';

import { PdfProtectService } from '../../../../services/pdf-protect.service';

const fs = window.require('fs');

export const PDF_DOCUMENT_VALIDATOR = new InjectionToken<string>('pdfDocumentValidation');

export const pdfDocumentValidatorProvider: Provider = {
  provide: PDF_DOCUMENT_VALIDATOR,
  useFactory: pdfDocumentValidator,
  deps: [PdfProtectService]
};

export function pdfDocumentValidator(pdfService: PdfProtectService): AsyncValidatorFn {
  // Use debounce as per https://github.com/angular/angular/issues/21500
  return utils.debounce(getValidator(pdfService), 250, true);
}

function getValidator(pdfService: PdfProtectService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;

    if (value === null || value.length === 0) {
      return observableOf(null);
    }

    if (!fs.existsSync(value)) {
      return observableOf(null);
    }

    return pdfService.pdfDocument(value)
      .pipe(
        map((isPdf: boolean): ValidationErrors | null => isPdf ? null : { notAPdfDocument : true }),
        catchError(err => errorHandler(err))
      );
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
