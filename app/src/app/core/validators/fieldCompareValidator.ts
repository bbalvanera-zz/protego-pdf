import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

export function fieldCompareValidator(field1Key: string, field2Key: string): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {
    return form.get(field1Key).value !== form.get(field2Key).value
      ? { mismatch: true }
      : null;
  };
}
