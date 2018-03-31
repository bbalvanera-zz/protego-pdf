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

import { environment } from '../../../environments/environment';
import { BrowserConsole } from './browser-console-transport';

const winston = window.require('winston');

const format  = winston.format.printf((info: any) => {
  return `${info.timestamp} ${(info.level + ':').padEnd(7)} ${info.message}`;
});

let transport: any;
if (environment.production) {
  transport = new winston.transports.File({
    filename: 'protego-pdf.log',
    level: 'info',
    timestamp: false,
    json: false,
    showLevel: false
  });
} else {
  transport = new BrowserConsole();
}

winston.configure({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp({ format: 'YYYY.MM.DD HH:mm:ss' }), format),
  transports: [
    transport
  ]
});

export class Logger {
  public static error(message: string): void {
    winston.error(message);
  }
}
