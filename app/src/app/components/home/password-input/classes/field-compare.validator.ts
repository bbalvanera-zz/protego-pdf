import { FormGroup, ValidationErrors } from '@angular/forms';

export function fieldCompareValidator(form: FormGroup): ValidationErrors | null {
  return form.get('password').value !== form.get('passwordConfirm').value
    ? { mismatch: true }
    : null;
}
