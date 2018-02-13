import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

import { PdfProtectService } from '../../services/pdf-protect.service';
import { pdfDocumentValidator } from './pdfDocumentValidator';
import { fieldCompareValidator } from './fieldCompareValidator';

export class CustomValidators {
  public static pdfDocument(pdfService: PdfProtectService): AsyncValidatorFn {
    return pdfDocumentValidator(pdfService);
  }

  public static fieldCompare(formControlName1: string, formControlName2: string): ValidatorFn {
    return fieldCompareValidator(formControlName1, formControlName2);
  }
}
