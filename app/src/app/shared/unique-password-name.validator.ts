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
    console.log('call to validation');
    if (control.value.length === 0) {
      return observableOf(null);
    }

    // Use debounce as per https://github.com/angular/angular/issues/21500
    clearTimeout(timeout);
    return Observable.create(observer => {
      timeout = setTimeout(() => {
        timeout = null;
        console.log(`validating for ${control.value}`);
        savedPasswordsService.exists(control.value)
          .pipe(map(exists => exists ? { duplicated: true } : null))
          .subscribe(observer);
      }, 250);
    });
 };
}
