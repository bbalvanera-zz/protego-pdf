import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { filter } from 'rxjs/operators/filter';

import { PasswordOptions, equal } from './PasswordOptions';

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

  constructor(formBuilder: FormBuilder) {
    this.passwordOptions = formBuilder.group(this.innerValue);
  }

  public ngOnInit() {
    this.passwordOptions.valueChanges
      .pipe(
        takeUntil(this.unsubscriber),
        debounceTime(250),
        filter((value) => !equal(value, this.innerValue))
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
    if (value && !equal(value, this.innerValue)) {
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

  private onChange = (value: PasswordOptions) => { return; };
  private onTouch = () => { return; };

}
