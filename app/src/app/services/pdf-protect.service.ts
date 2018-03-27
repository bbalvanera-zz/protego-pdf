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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map } from 'rxjs/operators/map';

import { PdfProtectionOptions } from 'protego-pdf-helper';

const { isPdfDocument, isProtected, protect, unlock } = window.require('protego-pdf-helper');

@Injectable()
export class PdfProtectService {
  public isPdfDocument(file: string): Observable<boolean> {
    return fromPromise(isPdfDocument(file));
  }

  public isProtected(file: string): Observable<boolean> {
    return fromPromise(isProtected(file));
  }

  public protect(source: string, target: string, password: string, options?: PdfProtectionOptions): Observable<boolean> {
    return fromPromise<boolean>(protect(source, target, password, options || {}));
  }

  public unlock(source: string, target: string, password: string): Observable<boolean> {
    return fromPromise<boolean>(unlock(source, target, password));
  }
}
