/* tslint:disable */
import * as path from 'path';
import * as reload from 'electron-reload';
import * as devtron from 'devtron';

import { app, BrowserWindow, ipcMain, dialog, WebContents, OpenDialogOptions} from 'electron';
import { IEventArgs } from './IEventArgs';

let win: Electron.BrowserWindow;
const debugMode = /--debug/.test(process.argv[2]);

if (debugMode) {
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

ipcMain.on('ELECTRON_MAIN_PROC', (event: Electron.Event, args: IEventArgs) => {
  switch (args.message) {
    case 'OPEN_FILE_DIALOG':
      openFileDialog(event.sender);
      break;
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 445,
    resizable: true
  });

  win.loadURL(`file://${__dirname}/index.html`);

  if (debugMode) {
    win.webContents.openDevTools();
    devtron.install();
  } else {
    win.setMenu(null);
  }

  win.on('closed', () => {
    win = null;
  });
}

function openFileDialog(sender: WebContents) {
  const options: OpenDialogOptions = {
    properties: ['openFile'],
    filters: [
      {
        name: 'Pdf files',
        extensions: ['pdf']
      }
    ]
  };

  dialog.showOpenDialog(options, (files: string[]) => {
    const message: IEventArgs = {
      message: 'OPEN_FILE_DIALOG',
      data: files
    };

    sender.send('ELECTRON_RENDERER_PROC', message);
  });
}
