import { Component, Input, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

const PASSWORD_OPTION_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordOptionComponent),
  multi: true
};

@Component({
  selector: 'app-password-option',
  templateUrl: './password-option.component.html',
  styleUrls: ['./password-option.component.scss'],
  providers: [PASSWORD_OPTION_VALUE_ACCESSOR]
})
export class PasswordOptionComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private innerValue: boolean = null;
  private unsubscriber = new Subject<void>();

  public radioGroup = new FormControl();
  @Input() public label = '';

  public ngOnInit(): void {
    this.radioGroup.valueChanges
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((value: boolean) => {
        this.innerValue = value;
        this.onChange(value);
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
  }

  public writeValue(value: boolean): void {
    if (value !== undefined && value !== this.innerValue) {
      this.innerValue = value;
      this.radioGroup.setValue(value, { onlySelf: true, emitEvent: false, emitModelToViewChange: true });
    }
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  private onChange = (value: boolean): void => { return; };
  private onTouch = (): void => { return; };
}
