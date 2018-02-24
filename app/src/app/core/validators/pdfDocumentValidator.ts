import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

import { PdfProtectService } from '../../services/pdf-protect.service';

const fs = window.require('fs');

export function pdfDocumentValidator(pdfService: PdfProtectService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;

    if (value === null || value.length === 0) {
      return of(null);
    }

    if (!fs.existsSync(value)) {
      return of(null);
    }

    return pdfService.pdfDocument(value)
      .pipe(
        map((isPdf): ValidationErrors => isPdf ? null : { notAPdfDocument : true }),
        catchError((err, caught): Observable<ValidationErrors> => {
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

          return of(validationErrors);
        })
      );
  };
}
