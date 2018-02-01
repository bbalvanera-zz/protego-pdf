import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-option',
  templateUrl: './password-option.component.html',
  styleUrls: ['./password-option.component.scss']
})
export class PasswordOptionComponent {
  private _value: boolean = null;

  @Input() public label = '';

  @Input() public set value(value: boolean) {
    if (value !== this._value) {

      // if _value is null, means, it has not been set before and this is not a change.
      if (this._value !== null) {
        this.valueChange.emit(value);
      }

      this._value = value;
    }
  }

  public get value(): boolean {
    return this._value;
  }

  @Output() public valueChange = new EventEmitter<boolean>();
}
