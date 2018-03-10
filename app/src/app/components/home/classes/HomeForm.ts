import { FormControl, FormGroup, ValidatorFn, ValidationErrors, Validators, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';

import { PasswordInputComponent } from '../password-input/password-input.component';
import { PasswordInput } from '../password-input/classes/PasswordInput';

const DEFAULT_VALUES = {
  fileName: '',
  displayName: '',
  password: {
    password: '',
    passwordVisible: false
  }
};

function passwordInputRequiredValidator(control: FormControl): ValidationErrors | null {
  const value = control.value as PasswordInput;

  if (isEmptyPassword(value.password)) {
    return { required: true };
  }

  if (!value.passwordVisible && value.password !== value.passwordConfirm) {
    return { mismatch: true };
  }

  return null;
}

function isEmptyPassword(password: string): boolean {
  return password == null || password.length === 0;
}

/**
 * Provides convenience methods to interact with the HomeForm.
 */
export class HomeForm extends FormGroup {
  private passwordInput: PasswordInputComponent;

  constructor(passwordInput: PasswordInputComponent, pdfDocumentValidator: AsyncValidatorFn) {
    const controls = {
      fileName: new FormControl(DEFAULT_VALUES.fileName, Validators.required, pdfDocumentValidator),
      password: new FormControl(DEFAULT_VALUES.password, passwordInputRequiredValidator),
      displayName: new FormControl(DEFAULT_VALUES.displayName)
    };

    super(controls);

    this.passwordInput = passwordInput;
  }

  public get fileName(): FormControl { return this.get('fileName') as FormControl; }
  public get fileNameValue(): string { return this.fileName.value; }

  public get password(): FormControl { return this.get('password') as FormControl; }
  public get passwordValue(): string { return (this.password.value as PasswordInput).password; }

  public reset(): void {
    super.reset(DEFAULT_VALUES, { onlySelf: true, emitEvent: false });
    // `reset` would mark `passwordInputComponent` as pristine but not its children.
    // this method will mark its children as pristine.
    this.passwordInput.markAsPristine();
  }

  public markFileNameAsDirty(): void {
    this.fileName.markAsDirty({ onlySelf: true });
  }

  public setFileNameErrors(errors: ValidationErrors | null): void {
    this.fileName.setErrors(errors);
  }

  public showValidation(): void {
    // show validation errors by marking each control as dirty
    const controls = this.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.get(controlName);
        control.markAsDirty({ onlySelf: true });
      }
    }

    this.passwordInput.showValidation();
  }
}
