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

import { PasswordOptions } from './password-options';
const crypto = window.require('crypto');

const CHARS = {
  lower: 'zxcvbnmlkjhgfdsaqwertyuiop',
  upper: 'POIUYTREWQASDFGHJKLMNBVCXZ',
  numbers: '8976405132',
  special: '!@#$%&*,.'
};

export class PasswordGenerator {
  public static generate(options: PasswordOptions): string {
    if (options.passwordLength < 0 || options.passwordLength > 100) {
      throw new Error('ArgumentOutOfRange');
    }

    const chars = this.getChars(options);
    const rnd = crypto.randomBytes(options.passwordLength);
    const pwd = new Array<string>(options.passwordLength);
    const len = chars.length;

    for (let i = 0; i < options.passwordLength; i++) {
      pwd[i] = chars[rnd[i] % len];
    }

    return pwd.join('');
  }

  private static getChars(options: PasswordOptions): string {
    let retVal = '';

    retVal += options.lowerCase ? CHARS.lower : '';
    retVal += options.upperCase ? CHARS.upper : '';
    retVal += options.numbers ? CHARS.numbers : '';
    retVal += options.specialChars ? CHARS.special : '';

    return retVal;
  }
}
