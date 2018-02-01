import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const PASSWORD_OPTIONS_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordOptionsComponent),
  multi: true
};

@Component({
  selector: 'app-password-options',
  templateUrl: './password-options.component.html',
  styleUrls: ['./password-options.component.scss'],
  providers: [PASSWORD_OPTIONS_CONTROL_VALUE_ACCESSOR]
})
export class PasswordOptionsComponent implements ControlValueAccessor {
  private model = new PasswordOptions();

  private onChange = (value: PasswordOptions): void => {};
  private onTouched = (): void => {};

  public get options(): PasswordOptions {
    return this.model;
  }

  public set options(value: PasswordOptions) {
    if (value !== this.model) {
      this.model = value;
      this.onChange(value);
    }
  }

  public optionChanged(option: string, value: boolean): void {
    if (value !== this.model[option]) {
      this.options[option] = value;
      this.onChange(this.model);
    }
  }

  public writeValue(value: PasswordOptions) {
    if (value !== this.model) {
      this.model = value;
    }
  }

  public registerOnChange(fn: (value: PasswordOptions) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  // private _options = new PasswordOptions();

  // @Input()
  // public set options(otherOptions: PasswordOptions) {
  //   this._options = new PasswordOptions(otherOptions);
  //   this._options.onChange = () => {
  //     this.optionsChange.emit(new PasswordOptions(this._options));
  //   }
  // }

  // public get options(): PasswordOptions {
  //   return this._options;
  // }

  // @Output() public optionsChange = new EventEmitter<PasswordOptions>();
}

export class PasswordOptions {
  public lowerCase = false;
  public upperCase = false;
  public numbers = false;
  public specialChars = false;
  public passwordLength = 0;

  // protected _lowerCase = false;
  // protected _upperCase = false;
  // protected _numbers = false;
  // protected _specialChars = false;

  // public get lowerCase(): boolean { return this._lowerCase; }
  // public set lowerCase(value: boolean) { this._lowerCase = value; }

  // public get upperCase(): boolean { return this._upperCase; }
  // public set upperCase(value: boolean) { this._upperCase = value; }

  // public get numbers(): boolean { return this._numbers; }
  // public set numbers(value: boolean) { this._numbers = value; }

  // public get specialCharacters(): boolean { return this._specialChars; }
  // public set specialCharacters(value: boolean) { this._specialChars = value; }

  // constructor(options?: PasswordOptions) {
  //   if (options) {
  //     this.lowerCase = options.lowerCase;
  //     this.upperCase = options.upperCase;
  //     this.numbers = options.numbers;
  //     this.specialCharacters = options.specialCharacters;
  //   }
  // }
}

// class PasswordOptionsNotifier extends PasswordOptions {
//   public onChange = (): void => {};

//   public set lowerCase(value: boolean) {
//     if (value !== this._lowerCase) {
//       this._lowerCase = value;
//       this.onChange();
//     }
//   }

//   public set upperCase(value: boolean) {
//     if (value !== this._upperCase) {
//       this._upperCase = value;
//       this.onChange();
//     }
//   }
// }
