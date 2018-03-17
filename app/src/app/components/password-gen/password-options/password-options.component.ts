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

import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';

import { PasswordOptions } from '../classes/password-options';

const PASSWORD_OPTIONS_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordOptionsComponent),
  multi: true
};

@Component({
  selector: 'app-password-options',
  templateUrl: './password-options.component.html',
  styleUrls: ['./password-options.component.scss'],
  providers: [PASSWORD_OPTIONS_VALUE_ACCESSOR]
})
export class PasswordOptionsComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private innerValue   = new PasswordOptions();
  private unsubscriber = new Subject<void>();

  public passwordOptions: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.createForm(formBuilder);
  }

  public get passwordLength(): AbstractControl { return this.passwordOptions.get('passwordLength'); }

  public ngOnInit(): void {
    this.passwordOptions.valueChanges
      .pipe(
        takeUntil(this.unsubscriber),
        debounceTime(250),
        map((value: PasswordOptions) => {
          value.passwordLength = Math.abs(value.passwordLength);
          value.passwordLength = Math.trunc(value.passwordLength);

          return value;
        }),
        filter((value: PasswordOptions) => {
          return this.passwordOptions.status === 'VALID' &&
                 !PasswordOptions.equal(value, this.innerValue) &&
                 value.passwordLength >= 0;
        })
      )
      .subscribe((value: PasswordOptions) => {
        this.innerValue = value;
        this.onChange(value);
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
  }

  public writeValue(value: PasswordOptions): void {
    if (value && !PasswordOptions.equal(value, this.innerValue)) {
      this.innerValue = value;
      this.passwordOptions.setValue(value);
    }
  }

  public registerOnChange(fn: (value: PasswordOptions) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  private createForm(builder: FormBuilder): void {
    const { passwordLength, lowerCase, upperCase, numbers, specialChars } = this.innerValue;

    this.passwordOptions = builder.group({
      passwordLength: [
        passwordLength,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(32)]
        )
      ],
      lowerCase,
      upperCase,
      numbers,
      specialChars
    });
  }

  private onChange = (value: PasswordOptions) => { return; };
  private onTouch = () => { return; };
}
