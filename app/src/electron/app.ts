import * as path from 'path';
import * as reload from 'electron-reload';
import * as devtron from 'devtron';

import { app, BrowserWindow, ipcMain } from 'electron';

const debugMode = /--debug/.test(process.argv[2]);

let win: Electron.BrowserWindow;

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

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 445,
    resizable: false
  });

  win.loadURL(`file://${__dirname}/index.html`);

  if (debugMode) {
    win.webContents.openDevTools();
    reload(__dirname);
    devtron.install();
  } else {
    win.setMenu(null);
  }

  win.on('closed', () => {
    win = null;
  });
}
