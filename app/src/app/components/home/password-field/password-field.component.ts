import { Component, OnInit, Provider, forwardRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { filter } from 'rxjs/operators/filter';

import { FocusWithinDirective } from './focus-within/focus-within.directive';
import { CustomValidators } from '../../../core/validators/CustomValidators';

const PASSWORD_FIELD_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordFieldComponent),
  multi: true
};

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
  providers: [PASSWORD_FIELD_VALUE_ACCESSOR, FocusWithinDirective]
})
export class PasswordFieldComponent implements ControlValueAccessor, OnInit {
  private form: FormGroup;

  public readonly showPassword = false; // used only by the view;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group(
    {
      password: ['', Validators.required],
      passwordConfirm: ['']
    },
    {
      validator: CustomValidators.fieldCompare('password', 'passwordConfirm')
    });
  }

  public ngOnInit(): void {
    this.form.valueChanges
      .pipe(filter(value => !this.form.errors))
      .subscribe(value => this.onChange(value.password));
  }

  public writeValue(value: string): void {
    if (value && value !== this.password.value) {
      this.form.setValue({ password: value, passwordConfirm: value }, { emitEvent: false });
    }
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public markAsDirty(): void {
    const controls = this.form.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.form.get(controlName);
        control.markAsDirty();
      }
    }
  }

  private togglePasswordVisibility(state: boolean): void {
    (this as { showPassword: boolean }).showPassword = state;

    if (this.showPassword) {
      this.form.clearValidators();
      this.passwordConfirm.setValue('', { onlySelf: true, emitEvent: false });
      this.passwordConfirm.disable();
    } else {
      this.passwordConfirm.enable();
      this.passwordConfirm.setValue(this.password.value, { onlySelf: true, emitEvent: false });
      this.form.setValidators(CustomValidators.fieldCompare('password', 'passwordConfirm'));
    }
  }

  private get password(): FormControl { return this.form.get('password') as FormControl; }
  private get passwordConfirm(): FormControl { return this.form.get('passwordConfirm') as FormControl; }

  private onChange = (value: string): void => { return; };
  private onTouch = (): void => { return; };
}
