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
