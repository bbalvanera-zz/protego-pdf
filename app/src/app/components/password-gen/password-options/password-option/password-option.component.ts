/**
 * Copyright (C) 2018 Bernardo Balvanera
 *
 * This file is part of ProtegoPdf.
 *
 * ProtegoPdf is a free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

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
