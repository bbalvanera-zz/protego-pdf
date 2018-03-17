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

import { Component, OnInit, OnDestroy, Provider, forwardRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { PasswordInput } from './classes/password-input';
import { PasswordInputForm } from './classes/password-input.form';
import { PasswordStrengthMeterDirective } from './password-strength-meter/password-strength-meter.directive';

const PASSWORD_INPUT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordInputComponent),
  multi: true
};

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  providers: [PASSWORD_INPUT_VALUE_ACCESSOR]
})
export class PasswordInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild(PasswordStrengthMeterDirective)
  private passwordStrengthMeter: PasswordStrengthMeterDirective;
  private unsubscribe: Subject<void>;

  public form: PasswordInputForm;

  constructor() {
    this.unsubscribe = new Subject<void>();
  }

  public ngOnInit(): void {
    this.form = new PasswordInputForm(this.passwordStrengthMeter);
    this.form.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(values => this.onChange(values));
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  public writeValue({ password, passwordVisible }: PasswordInput): void {
    // this method ignores `passwordConfirm` value if passed. This is because
    // the control would not allow mismatched values and so only `password` value is utilized.

    if (passwordVisible === undefined) {
      passwordVisible = this.form.passwordVisible;
    }

    const values = {
      password,
      passwordConfirm: passwordVisible ? '' : password,
      passwordVisible,
    };

    this.form.setValue(values, { emitEvent: false });
    this.togglePasswordVisibility(passwordVisible);

    // `setTimeout` is required since angular doesn't like view changes inside this method.
    // It works since it is actually another thread the one causing view modifications not the current one.
    setTimeout(() => this.updatePasswordStrength());
  }

  public registerOnChange(fn: (value: PasswordInput) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public showValidation(): void {
    this.form.showValidation();
  }

  public markAsPristine(): void {
    this.form.markChildrenAsPristine();
  }

  public togglePasswordVisibility(visibility: boolean): void {
    visibility
      ? this.form.disablePasswordConfirm()
      : this.form.enablePasswordConfirm();
  }

  private updatePasswordStrength(): void {
    this.passwordStrengthMeter.updatePasswordStrength();
  }

  private onChange = (value: PasswordInput): void => { return; };
  private onTouch = (): void => { return; };
}
