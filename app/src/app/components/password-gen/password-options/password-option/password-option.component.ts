import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const PASSWORD_OPTION_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordOptionComponent),
  multi: true
};

@Component({
  selector: 'app-password-option',
  templateUrl: './password-option.component.html',
  styleUrls: ['./password-option.component.scss'],
  providers: [PASSWORD_OPTION_CONTROL_VALUE_ACCESSOR]
})
export class PasswordOptionComponent implements ControlValueAccessor {
  private model = false;

  private onChange = (value: boolean): void => {};
  private onTouched = (): void => {};

  @Input() public label = '';

  public get value(): boolean {
    return this.model;
  }

  public set value(value: boolean) {
    if (value !== this.model) {
      this.model = value;
      this.onChange(value);
    }
  }

  writeValue(value: boolean): void {
    if (value !== this.model) {
      this.model = value;
    }
  }

  registerOnChange(fn: (value: boolean) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
