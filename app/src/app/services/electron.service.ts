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

  public openFileManager(location?: string): void {
    const { shell } = window.require('electron');
    const os = window.require('os');

    shell.showItemInFolder(location || os.homedir());
  }

  public getSavePath(): Observable<string> {
    if (!this.electron()) {
      throw new Error('InvalidOperation: Can only call within an electron process');
    }

    const opts: OpenDialogOptions = {
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

  private send(message: any, data?: any): void {
    const ipcMessage: EventArgs = {
      message,
      data
    };

    this.ipcRenderer.send('ELECTRON_MAIN_PROC', ipcMessage);
  }
}
