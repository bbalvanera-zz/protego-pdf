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

import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators, ValidationErrors } from '@angular/forms';

import { PasswordStrengthMeterDirective } from '../password-strength-meter/password-strength-meter.directive';
import { fieldCompareValidator } from './field-compare.validator';

/**
 * Provides convenience methods to work with the PasswordInput Form
 */
export class PasswordInputForm extends FormGroup {
  private passwordStrengthMeter: PasswordStrengthMeterDirective;

  constructor(passwordStrengthMeter: PasswordStrengthMeterDirective) {
    const controls = {
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(32)])
      ),
      passwordConfirm: new FormControl(''),
      passwordVisible: new FormControl(false)
    };

    super(controls, fieldCompareValidator);

    this.passwordStrengthMeter = passwordStrengthMeter;
  }

  public get password(): FormControl { return this.get('password') as FormControl; }
  public get passwordValue(): string { return this.password.value; }

  public get passwordConfirm(): FormControl { return this.get('passwordConfirm') as FormControl; }
  public get passwordStrength(): number { return this.passwordStrengthMeter.passwordStrength; }
  public get passwordVisible(): boolean { return this.get('passwordVisible').value; }

  public disablePasswordConfirm(): void {
    this.clearValidators();
    this.passwordConfirm.setValue('');
    this.passwordConfirm.disable();
  }

  public enablePasswordConfirm(): void {
    this.passwordConfirm.enable();
    this.passwordConfirm.setValue(this.passwordValue);
    this.setValidators(fieldCompareValidator);
  }

  public updatePasswordStrength(): void {
    this.passwordStrengthMeter.updatePasswordStrength();
  }

  public showValidation(): void {
    const controls = this.controls;

    // Code adapted from Angular Reactive Forms: trigger validation on submit
    // - Loiane Groner,  https://loiane.com/2017/08/angular-reactive-forms-trigger-validation-on-submit/
    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.get(controlName);
        control.markAsDirty({ onlySelf: true });
      }
    }
  }

  public markChildrenAsPristine(): void {
    const controls = this.controls;

    // Code adapted from Angular Reactive Forms: trigger validation on submit
    // - Loiane Groner,  https://loiane.com/2017/08/angular-reactive-forms-trigger-validation-on-submit/
    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.get(controlName);
        control.markAsPristine({ onlySelf: true });
      }
    }

    super.markAsPristine();
  }
}
