export class PasswordOptions {
  public lowerCase = true;
  public upperCase = true;
  public numbers = true;
  public specialChars = true;
  public passwordLength = 20;
}

export function equal(left: PasswordOptions, right: PasswordOptions): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }

  return left.lowerCase === right.lowerCase &&
         left.upperCase === right.upperCase &&
         left.numbers === right.numbers &&
         left.specialChars === right.specialChars &&
         left.passwordLength === right.passwordLength;
}
