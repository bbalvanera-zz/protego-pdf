/* tslint:disable:interface-name */
declare global {
  interface Window {
    require: (...args: string[]) => any;
    process: any;
  }
}
/* tslint:enable:interface-name */

import { Subject } from 'rxjs/Subject';
import { ChildProcess } from 'child_process';
import { Injectable } from '@angular/core';

@Injectable()
export class ElectronService {
  private ipcRenderer: Electron.IpcRenderer;
  private childProcess: ChildProcess;
  private selectFileSubject = new Subject<string>();

  constructor() {
    if (this.electron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');

      this.ipcRenderer.on('file-selected', (e: Electron.Event, file: string) => this.selectFileSubject.next(file));
    }
  }

  public electron(): boolean {
    return window && window.process && window.process.type;
  }

  public selectFile(): Subject<string> {
    if (!this.electron()) {
      throw new Error('InvalidOperation: Can only call within an electron process');
    }

    return this.selectFileSubject;
  }
}
