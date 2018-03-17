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

import { FormControl, ValidationErrors } from '@angular/forms';
import { PasswordInput } from '../password-input/classes/password-input';

export function passwordInputValidator(control: FormControl): ValidationErrors | null {
  const value = control.value as PasswordInput;

  if (isEmptyPassword(value.password)) {
    return { required: true };
  }

  if (value.password.length > 32) {
    return { maxlength: true };
  }

  if (value.passwordVisible === false && value.password !== value.passwordConfirm) {
    return { mismatch: true };
  }

  return null;
}

function isEmptyPassword(password: string): boolean {
  return password == null || password.length === 0;
}
