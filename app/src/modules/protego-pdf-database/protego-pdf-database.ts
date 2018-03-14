import idb, { DB, UpgradeDB } from 'idb';

import { SavedPasswordsStore } from './saved-passwords-store';

const storeName = 'savedPasswords';

export class ProtegoPdfDatabase {
  private readonly db: Promise<DB>;
  private wasUpgraded: boolean;

  constructor() {
    this.wasUpgraded = false;
    this.db = idb.open('protego-pdf', 1, db => this.upgrade(db));

    // this.db.then(db => {
    //   if (this.wasUpgraded) {
    //     this.seed().then(() => console.log('done seeding'));
    //   }
    // });
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

  // private seed(): Promise<void> {
  //   const letters = 'abcdefghijlkmnopqrstuvwxyz';
  //   const promise = this.db
  //     .then(db => {
  //       const trans     = db.transaction(storeName, 'readwrite');
  //       const store     = trans.objectStore(storeName);

  //       for (let i = 0; i < 20; i++) {
  //         const item = {
  //           name: letters.charAt(i),
  //           password: 'wafsdfsd',
  //           favorite: Math.floor((Math.random() * 2))
  //         }

  //         store.add(item);
  //       }

  //       return trans.complete
  //     });

  //   return promise;
  // }
}
