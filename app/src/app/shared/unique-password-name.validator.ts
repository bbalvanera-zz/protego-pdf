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

import { InjectionToken, Provider } from '@angular/core';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { debounceTime } from 'rxjs/operators/debounceTime';
import * as utils from 'underscore';

import { SavedPasswordsService } from '../services/saved-passwords.service';
import { Subject } from 'rxjs/Subject';

export const UNIQUE_PASSWORD_NAME_VALIDATOR = new InjectionToken<string>('uniquePasswordNameValidator');

export const uniquePasswordNameValidatorProvider: Provider = {
  provide: UNIQUE_PASSWORD_NAME_VALIDATOR,
  useFactory: uniquePasswordNameValidator,
  deps: [SavedPasswordsService]
};

let timeout;

export function uniquePasswordNameValidator(savedPasswordsService: SavedPasswordsService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (control.value.length === 0) {
      return observableOf(null);
    }

    // Use debounce as per https://github.com/angular/angular/issues/21500
    clearTimeout(timeout);
    return Observable.create(observer => {
      timeout = setTimeout(() => {
        timeout = null;

        savedPasswordsService.exists(control.value)
          .pipe(map(exists => exists ? { duplicated: true } : null))
          .subscribe(observer);
      }, 250);
    });
 };
}
