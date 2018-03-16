const TransportStream = window.require('winston-transport');
const { LEVEL, MESSAGE } = require('triple-beam');

export class BrowserConsole extends TransportStream {

  public log(info: any, callback: any): void {
    setImmediate(() => (this as any).emit('logger', info));

    info[LEVEL] === 'error' ? console.error(info[MESSAGE]) : console.log(info[MESSAGE]);

    if (callback) {
      callback();
    }
  }
}
