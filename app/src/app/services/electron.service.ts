/* tslint:disable:interface-name */
declare global {
  interface Window {
    require: (...args: string[]) => any;
    process: any;
  }
}
/* tslint:enable:interface-name */

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { IEventArgs } from '../../electron/IEventArgs';

@Injectable()
export class ElectronService {
  private ipcRenderer: Electron.IpcRenderer;

  private selectFileSubject = new Subject<string[]>();

  constructor() {
    if (this.electron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;

      this.ipcRenderer.on('ELECTRON_RENDERER_PROC', (event: Electron.Event, args: IEventArgs) => {
        switch (args.message) {
          case 'OPEN_FILE_DIALOG':
            this.selectFileSubject.next(args.data);
            break;
        }
      });
    }
  }

  public electron(): boolean {
    return window && window.process && window.process.type;
  }

  public selectFile(): Observable<string[]> {
    if (!this.electron()) {
      throw new Error('InvalidOperation: Can only call within an electron process');
    }

    this.send('OPEN_FILE_DIALOG');
    return this.selectFileSubject.pipe(first());
  }

  private send(message: any, data?: any) {
    const ipcMessage: IEventArgs = {
      message,
      data
    };

    this.ipcRenderer.send('ELECTRON_MAIN_PROC', ipcMessage);
  }
}
