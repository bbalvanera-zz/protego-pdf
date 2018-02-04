import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';

import { PasswordOptions } from '../../../core/PasswordOptions';

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
  private innerValue = new PasswordOptions();
  private unsubscriber = new Subject<void>();

  public passwordOptions: FormGroup;

  public get passwordLength() { return this.passwordOptions.get('passwordLength'); }

  constructor(formBuilder: FormBuilder) {
    this.createForm(formBuilder);
  }

  public ngOnInit() {
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

  public ngOnDestroy() {
    this.unsubscriber.next();
  }

  public writeValue(value: PasswordOptions) {
    if (value && !PasswordOptions.equal(value, this.innerValue)) {
      this.innerValue = value;
      this.passwordOptions.setValue(value);
    }
  }

  public registerOnChange(fn: (value: PasswordOptions) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  private createForm(builder: FormBuilder) {
    const { passwordLength, lowerCase, upperCase, numbers, specialChars } = this.innerValue;

    this.passwordOptions = builder.group({
      passwordLength: [passwordLength, Validators.compose([Validators.required, Validators.min(0), Validators.max(100)])],
      lowerCase,
      upperCase,
      numbers,
      specialChars
    });
  }

  private onChange = (value: PasswordOptions) => { return; };
  private onTouch = () => { return; };
}
