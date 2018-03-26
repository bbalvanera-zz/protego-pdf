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

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { PasswordInput } from './classes/password-input';
import { PasswordInputForm } from './classes/password-input.form';
import { PasswordStrengthMeterDirective } from './password-strength-meter/password-strength-meter.directive';
import { IPasswordInput } from './ipassword-input';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent implements IPasswordInput, OnInit, AfterViewInit {
  @ViewChild(PasswordStrengthMeterDirective)
  private passwordStrengthMeter: PasswordStrengthMeterDirective;
  private pendingValue: { password?: string, passwordVisible?: boolean };

  public form: PasswordInputForm;

  public get value(): { password: string, passwordVisible: boolean } {
    return (this.form.value as { password: string, passwordVisible: boolean });
  }

  public get valid(): boolean {
    return this.form.valid;
  }

  public ngOnInit(): void {
    this.form = new PasswordInputForm(this.passwordStrengthMeter);
  }

  public ngAfterViewInit(): void {
    if (this.pendingValue) {
      setTimeout(() => {
        this.setValue(this.pendingValue);
        this.togglePasswordVisibility(this.pendingValue.passwordVisible);
        this.updatePasswordStrength();
      });
    }
  }

  public togglePasswordVisibility(visibility: boolean): void {
    visibility
      ? this.form.disablePasswordConfirm()
      : this.form.enablePasswordConfirm();
  }

  public setValue(value: { password?: string, passwordVisible?: boolean }): void {
    // this method could be called before ngOnInit and before `this.form` is set.
    // Use pending value to hold value until `this.form` is set.
    if (!this.form) {
      this.pendingValue = value;
      return;
    }

    const patch = {
      password: value.password,
      passwordConfirm: !value.passwordVisible ? value.password : '',
      passwordVisible: !!value.passwordVisible
    };

    this.form.setValue(patch);
  }

  public ensureValue(): void {
    this.form.showValidation();
  }

  public reset(): void {
    this.form.reset();
    this.form.markChildrenAsPristine();
    this.form.updatePasswordStrength();
    this.togglePasswordVisibility(false);
  }

  private updatePasswordStrength(): void {
    this.form.updatePasswordStrength();
  }

  private onChange = (value: PasswordInput): void => { return; };
  private onTouch = (): void => { return; };
}
