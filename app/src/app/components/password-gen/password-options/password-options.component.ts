import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-options',
  templateUrl: './password-options.component.html',
  styleUrls: ['./password-options.component.scss'],
})
export class PasswordOptionsComponent {
  private _options: PasswordOptions;

  @Input() public set options(value: PasswordOptions) {
    if (value === null) {
      return;
    }

    if (value !== this._options) {
      if (this._options) {
        this.optionsChange.emit(this._options);
      }
      this._options = value;
    }
  }

  public get options(): PasswordOptions {
    return this._options || new PasswordOptions();
  }

  @Output() optionsChange = new EventEmitter<PasswordOptions>();

  public optionChanged(option: string, value: boolean) {
    if (value !== this._options[option]) {
      this._options[option] = value;
      this.optionsChange.emit(this._options);
    }
  }
}

export class PasswordOptions {
  public lowerCase = false;
  public upperCase = false;
  public numbers = false;
  public specialChars = false;
  public passwordLength = 0;
}
