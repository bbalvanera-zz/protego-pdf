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

/* tslint:disable:variable-name */
const TransportStream = window.require('winston-transport');
const { LEVEL, MESSAGE } = window.require('triple-beam');

export class BrowserConsole extends TransportStream {

  public log(info: any, callback: any): void {
    setImmediate(() => (this as any).emit('logger', info));

    /* tslint:disable:no-console */
    info[LEVEL] === 'error' ? console.error(info[MESSAGE]) : console.log(info[MESSAGE]);

    if (callback) {
      callback();
    }
  }
}
