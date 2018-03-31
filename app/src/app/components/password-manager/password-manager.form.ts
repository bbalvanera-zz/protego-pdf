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

import { FormGroup, Validators, FormControl, AsyncValidatorFn } from '@angular/forms';

const DEFAULT_VALUES = {
  name: '',
  password: '',
  favorite: false,
};

export class PasswordManagerForm extends FormGroup {
  constructor(uniquePasswordNameValidator: AsyncValidatorFn) {
    const controls = {
      name: new FormControl(
        DEFAULT_VALUES.name,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
        uniquePasswordNameValidator
      ),
      password: new FormControl(
        DEFAULT_VALUES.password,
        Validators.compose([Validators.required, Validators.maxLength(32)]) // 32 max pwd ln per spec
      ),
      favorite: new FormControl(DEFAULT_VALUES.favorite)
    };

    super(controls);
  }

  public get name(): FormControl { return this.get('name') as FormControl; }
  public get nameValue(): string { return this.name.value; }

  public get password(): FormControl { return this.get('password') as FormControl; }
  public get passwordValue(): string { return this.password.value; }

  public get favorite(): FormControl { return this.get('favorite') as FormControl; }
  public get favoriteValue(): boolean { return this.favorite.value; }

  public reset(): void {
    super.reset({ }, { onlySelf: true, emitEvent: false });
  }

  public showValidation(): void {
    const controls = this.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.get(controlName);
        control.markAsDirty({ onlySelf: true });
      }
    }
  }
}
