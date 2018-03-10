import { FormControl, ValidationErrors } from '@angular/forms';
import { PasswordInput } from '../../password-input/classes/PasswordInput';

export function passwordInputRequiredValidator(control: FormControl): ValidationErrors | null {
  const value = control.value as PasswordInput;

  if (isEmptyPassword(value.password)) {
    return { required: true };
  }

  if (value.passwordVisible === false && value.password !== value.passwordConfirm) {
    return { mismatch: true };
  }

  return null;
}

function isEmptyPassword(password: string): boolean {
  return password == null || password.length === 0;
}
