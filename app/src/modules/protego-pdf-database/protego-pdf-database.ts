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

import idb, { DB, UpgradeDB } from 'idb';

import { SavedPasswordsStore } from './saved-passwords-store';

const storeName = 'savedPasswords';

export class ProtegoPdfDatabase {
  private readonly db: Promise<DB>;
  private wasUpgraded: boolean;

  constructor() {
    this.wasUpgraded = false;
    this.db = idb.open('protego-pdf', 1, db => this.upgrade(db));
  }

  public get savedPasswords(): SavedPasswordsStore {
    return new SavedPasswordsStore(this.db);
  }

  private upgrade(db: UpgradeDB): void {
    switch (db.oldVersion) {
      case 0:
        const savedPasswords = db.createObjectStore(storeName, { keyPath: 'name' });
        savedPasswords.createIndex('favorite', 'favorite');
        break;
    }

    this.wasUpgraded = true;
  }
}
