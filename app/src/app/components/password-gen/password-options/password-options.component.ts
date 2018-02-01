import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-options',
  templateUrl: './password-options.component.html',
  styleUrls: ['./password-options.component.scss']
})
export class PasswordOptionsComponent {
  private _options = new PasswordOptions();

  @Input()
  public set options(otherOptions: PasswordOptions) {
    this._options = new PasswordOptions(otherOptions);
    this._options.onChange = () => {
      this.optionsChange.emit(new PasswordOptions(this._options));
    }
  }

  public get options(): PasswordOptions {
    return this._options;
  }

  @Output() public optionsChange = new EventEmitter<PasswordOptions>();
}

export class PasswordOptions {
  private _lowerCase = false;
  private _upperCase = false;
  private _numbers = false;
  private _specialChars = false;

  public onChange: () => void;

  public get lowerCase(): boolean { return this._lowerCase; }
  public set lowerCase(value: boolean) {
    this._lowerCase = value;
    this.notifyChange();
  }

  public get upperCase(): boolean { return this._upperCase; }
  public set upperCase(value: boolean) {
    this._upperCase = value;
    this.notifyChange();
  }

  public get numbers(): boolean { return this._numbers; }
  public set numbers(value: boolean) {
    this._numbers = value;
    this.notifyChange();
  }

  public get specialCharacters(): boolean { return this._specialChars; }
  public set specialCharacters(value: boolean) {
    this._specialChars = value;
    this.notifyChange();
  }

  constructor(options?: PasswordOptions) {
    if (options) {
      this.lowerCase = options.lowerCase;
      this.upperCase = options.upperCase;
      this.numbers = options.numbers;
      this.specialCharacters = options.specialCharacters;
    }
  }

  private notifyChange() {
    if (this.onChange) {
      this.onChange();
    }
  }
}
