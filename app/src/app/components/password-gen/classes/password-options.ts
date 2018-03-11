export class PasswordOptions {
  public lowerCase: boolean;
  public upperCase: boolean;
  public numbers: boolean;
  public specialChars: boolean;
  public passwordLength: number;

  public static equal(left: PasswordOptions, right: PasswordOptions): boolean {
    if (left === undefined || right === undefined) {
      return false;
    }

    return left.lowerCase === right.lowerCase &&
           left.upperCase === right.upperCase &&
           left.numbers === right.numbers &&
           left.specialChars === right.specialChars &&
           left.passwordLength === right.passwordLength;
  }
}
