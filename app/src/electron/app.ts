/* tslint:disable */
import * as path from 'path';
import * as reload from 'electron-reload';
import * as devtron from 'devtron';

import { app, BrowserWindow, ipcMain, dialog, WebContents, OpenDialogOptions} from 'electron';
import { EventArgs } from './EventArgs';

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
    height: 500,
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
