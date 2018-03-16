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
