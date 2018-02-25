// helped by https://stackoverflow.com/questions/42461852/angular-2-inject-service-manually

import { Injector } from '@angular/core';

export class ServiceLocator {
  /* tslint:disable:member-access */
  // don't use directly. Use get instead.
  static injector: Injector;

  static get(token: any): any {
    return ServiceLocator.injector.get(token);
  }
}
