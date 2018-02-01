import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-option',
  templateUrl: './password-option.component.html',
  styleUrls: ['./password-option.component.scss']
})
export class PasswordOptionComponent {
  private _value = false;
  private _option = false;

  @Input() public label = '';

  @Input() public set option(value: boolean) {
    this._option = value;
  }

  public get option() {
    return this._option;
  }

  @Output() public optionChange = new EventEmitter<boolean>();

  public set value(value: boolean) {
    this._value = this.option = value;
    this.optionChange.emit(value);
  }

  public get value(): boolean {
    return this._value;
  }
}
