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

import { FormControl, FormGroup, ValidatorFn, ValidationErrors, Validators, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';

import { PasswordInputComponent } from '../password-input/password-input.component';
import { PasswordInput } from '../password-input/classes/password-input';
import { passwordInputValidator } from './password-input.validator';

const DEFAULT_VALUES = {
  fileName: '',
  displayName: '',
  password: {
    password: '',
    passwordVisible: false
  }
};

/**
 * Provides convenience methods to interact with the LockPdfForm.
 */
export class LockPdfForm extends FormGroup {
  private passwordInput: PasswordInputComponent;

  constructor(passwordInput: PasswordInputComponent, pdfDocumentValidator: AsyncValidatorFn) {
    const controls = {
      fileName: new FormControl(DEFAULT_VALUES.fileName, Validators.required, pdfDocumentValidator),
      password: new FormControl(DEFAULT_VALUES.password, passwordInputValidator),
      displayName: new FormControl(DEFAULT_VALUES.displayName)
    };

    super(controls);

    this.passwordInput = passwordInput;
  }

  public get fileName(): FormControl { return this.get('fileName') as FormControl; }
  public get fileNameValue(): string { return this.fileName.value; }

  public get password(): FormControl { return this.get('password') as FormControl; }
  public get passwordValue(): string { return (this.password.value as PasswordInput).password; }
  public get passwordValid(): boolean { return !this.get('password').errors; }

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

    // Code adapted from Angular Reactive Forms: trigger validation on submit
    // - Loiane Groner,  https://loiane.com/2017/08/angular-reactive-forms-trigger-validation-on-submit/
    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.get(controlName);
        control.markAsDirty({ onlySelf: true });
      }
    }

    this.passwordInput.showValidation();
  }

  public ensurePasswordValue(): void {
    this.passwordInput.showValidation();
  }
}
