import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { map } from 'rxjs/operators/map';

import { PdfProtectService } from '../../services/pdf-protect.service';

const fs = window.require('fs');

export function pdfDocumentValidator(pdfService: PdfProtectService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value;

    if (value === null || value.length === 0) {
      return from([null]);
    }

    if (!fs.existsSync(value)) {
      return from([null]);
    }

    return pdfService.pdfDocument(value)
      .pipe(map((isPdf) => isPdf ? null : { notAPdfDocument : true }));
  };
}
