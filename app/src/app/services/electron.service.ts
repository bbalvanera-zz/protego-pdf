/* tslint:disable:interface-name */
declare global {
  interface Window {
    require: (...args: string[]) => any;
    process: any;
  }
}
/* tslint:enable:interface-name */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { OpenDialogOptions } from 'electron';

import { EventArgs } from '../../electron/EventArgs';

@Injectable()
export class ElectronService {
  private ipcRenderer: Electron.IpcRenderer;

  private selectFileSubject = new Subject<string[]>();
  private savePathSubject = new Subject<string>();

  constructor() {
    if (this.electron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;

      this.ipcRenderer.on('ELECTRON_RENDERER_PROC', (event: Electron.Event, args: EventArgs) => {
        switch (args.message) {
          case 'OPEN_FILE_DIALOG':
            this.selectFileSubject.next(args.data);
            break;
          case 'SAVE_FILE_DIALOG':
            this.savePathSubject.next(args.data);
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

    const opts: OpenDialogOptions = {
      title: 'Open Pdf document',
      properties: ['openFile'],
      filters: [
        {
          name: 'Pdf files',
          extensions: ['pdf']
        }
      ]
    };

    this.send('OPEN_FILE_DIALOG', opts);
    return this.selectFileSubject.pipe(first());
  }

  public getSavePath(): Observable<string> {
    if (!this.electron()) {
      throw new Error('InvalidOperation: Can only call within an electron process');
    }

    const opts: OpenDialogOptions = {
      title: 'Save protected Pdf file',
      filters: [
        {
          name: 'Pdf files',
          extensions: ['pdf']
        }
      ]
    };

    this.send('SAVE_FILE_DIALOG', opts);
    return this.savePathSubject.pipe(first());
  }

  public showInfoBox(title?: string, message?: string): void {
    const opts = {
      type: 'info',
      title,
      message,
      buttons: ['Ok']
    };

    this.send('MESSAGE_BOX', opts);
  }

  public showErrorBox(title?: string, message?: string): void {
    const opts = {
      type: 'error',
      title,
      message,
      buttons: ['Ok']
    };

    this.send('MESSAGE_BOX', opts);
  }

  private send(message: any, data?: any): void {
    const ipcMessage: EventArgs = {
      message,
      data
    };

    this.ipcRenderer.send('ELECTRON_MAIN_PROC', ipcMessage);
  }
}
