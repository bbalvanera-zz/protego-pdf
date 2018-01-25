import { PdfPermissions, EncryptionMode, EncryptionOption } from './enums';

export interface PdfProtectionOptions {
  userPassword?: string;
  ownerPassword?: string;
  permissions?: PdfPermissions;
  encryptionMode?: EncryptionMode;
  encryptionOption?: EncryptionOption;
}
