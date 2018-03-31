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

import { UpgradeDB, DB } from 'idb';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { fromPromise as observableFromPromise } from 'rxjs/observable/fromPromise';

import { SavedPassword } from './entities/saved-password';

const storeName = 'savedPasswords';

export class SavedPasswordsStore {
  constructor(private readonly db: Promise<DB>) {
  }

  public get(id: string = ''): Observable<SavedPassword> {
    if (id.length === 0) {
      return observableOf(null);
    }

    const promise = this.db
      .then(db => {
        const trans = db.transaction(storeName, 'readonly');
        const store = trans.objectStore(storeName);

        return store.get(id);
      });

    return observableFromPromise(promise);
  }

  public getAll(query?: Partial<SavedPassword>, count?: number): Observable<SavedPassword[]> {
    if (!query) {
      return this.getAllInternal(count);
    }

    if (query.name) {
      return this.get(query.name).pipe(map(single => [single]));
    } else if (query.favorite) {
      return this.getAllByFavorite(query.favorite, count);
    }
  }

  public add(value: SavedPassword): Observable<void> {
    const promise = this.db
      .then(db => {
        const trans = db.transaction(storeName, 'readwrite');
        const store = trans.objectStore<SavedPassword, string>(storeName);

        store.add(value);

        return trans.complete;
      });

    return observableFromPromise(promise);
  }

  public update(value: SavedPassword): Observable<void> {
    const promise = this.db
      .then(db => {
        const trans = db.transaction(storeName, 'readwrite');
        const store = trans.objectStore(storeName);

        store.put(value);

        return trans.complete;
      });

    return observableFromPromise(promise);
  }

  public delete(key: string): Observable<void> {
    const promise = this.db
      .then(db => {
        const trans = db.transaction(storeName, 'readwrite');
        const store = trans.objectStore(storeName);

        store.delete(key);

        return trans.complete;
      });

    return observableFromPromise(promise);
  }

  private getAllByFavorite(value: number, count?: number): Observable<SavedPassword[]> {
    const promise = this.db
      .then(db => {
        const trans     = db.transaction(storeName, 'readonly');
        const store     = trans.objectStore<SavedPassword, string>(storeName);
        const favorites = store.index<number>('favorite');

        return favorites.getAll(IDBKeyRange.only(value), count);
      });

    return observableFromPromise(promise);
  }

  private getAllInternal(count?: number): Observable<SavedPassword[]> {
    const promise = this.db
      .then(db => {
        const trans     = db.transaction(storeName, 'readonly');
        const store     = trans.objectStore<SavedPassword, string>(storeName);

        return store.getAll(undefined, count);
      });

    return observableFromPromise(promise);
  }
}
