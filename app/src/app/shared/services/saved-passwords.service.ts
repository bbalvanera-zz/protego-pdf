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

import idb, { UpgradeDB, DB } from 'idb';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators';

import { SavedPassword } from '../../../modules/protego-pdf-database/entities/saved-password';
import { ProtegoPdfDatabase } from '../../../modules/protego-pdf-database/protego-pdf-database';

@Injectable()
export class SavedPasswordsService {
  public db: ProtegoPdfDatabase;

  constructor() {
    this.db = new ProtegoPdfDatabase();
  }

  public exists(id: string = ''): Observable<boolean> {
    if (id.length === 0) {
      return observableOf(false);
    }

    return this.db.savedPasswords.get(id)
      .pipe(map(item => !!item));
  }

  public getFavorites(): Observable<SavedPassword[]> {
    return this.db.savedPasswords.getAll({ favorite: 1 }, 3);
  }

  public getAll(): Observable<SavedPassword[]> {
    return this.db.savedPasswords.getAll()
      .pipe(map(all => {
        // favorites on top
        const favorites = all.filter(p => p.favorite);
        const rest = all.filter(p => !p.favorite);

        return favorites.concat(rest);
      }));
  }

  public save(savedPwd: SavedPassword): Observable<void> {
    if (!savedPwd) {
      return observableOf();
    }

    if (!savedPwd.name || savedPwd.name.length === 0) {
      throw new Error('name cannot be empty');
    }

    if (!savedPwd.password || savedPwd.password.length === 0) {
      throw new Error('password cannot be empty');
    }

    return this.db.savedPasswords.get(savedPwd.name)
      .pipe(mergeMap(existing => {
        if (existing) {
          existing.password = savedPwd.password;
          existing.favorite = savedPwd.favorite;

          return this.db.savedPasswords.update(existing);
        } else {
          return this.db.savedPasswords.add(savedPwd);
        }
      }));
  }

  public delete(id: string): Observable<void> {
    return this.db.savedPasswords.delete(id);
  }
}
