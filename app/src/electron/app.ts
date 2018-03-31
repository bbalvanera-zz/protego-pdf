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

/* tslint:disable */
const path = require('path');

import { app, BrowserWindow, ipcMain, dialog, WebContents, OpenDialogOptions} from 'electron';
import { EventArgs } from './EventArgs';

let win: Electron.BrowserWindow;
const debugMode = /--debug/.test(process.argv[2]);

if (debugMode) {
  const reload = require('electron-reload');
  reload(__dirname);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('ELECTRON_MAIN_PROC', (event: Electron.Event, args: EventArgs) => {
  switch (args.message) {
    case 'OPEN_FILE_DIALOG':
      openFileDialog(event.sender, args.data);
      break;
    case 'SAVE_FILE_DIALOG':
      openSaveDialog(event.sender, args.data);
      break;
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 420,
    resizable: false,
    icon: path.join(__dirname, 'favicon.ico'),
    fullscreenable: false,
    maximizable: false,
    autoHideMenuBar: true
  });

  win.loadURL(`file://${__dirname}/index.html`);

  if (debugMode) {
    win.webContents.openDevTools();
    const devtron = require('devtron');
    devtron.install();
  } else {
    win.setMenu(null);
  }

  win.on('closed', () => {
    win = null;
  });
}

function openFileDialog(sender: WebContents, options: OpenDialogOptions) {
  dialog.showOpenDialog(win, options, (files: string[]) => {
    const message: EventArgs = {
      message: 'OPEN_FILE_DIALOG',
      data: files
    };

    sender.send('ELECTRON_RENDERER_PROC', message);
  });
}

function openSaveDialog(sender: WebContents, options: OpenDialogOptions) {
  dialog.showSaveDialog(win, options, file => {
    const message: EventArgs = {
      message: 'SAVE_FILE_DIALOG',
      data: file
    };

    sender.send('ELECTRON_RENDERER_PROC', message);
  });
}
