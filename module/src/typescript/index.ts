import { protegoPdfProxy } from './protegoPdfProxy';
import { PdfProtectionOptions } from './pdfProtectionOptions';
import { PdfOptions } from './pdfOptions';
import { OperationResult } from './operationResult';

export { PdfProtectionOptions } from './pdfProtectionOptions';
export { EncryptionMode, EncryptionOption, PdfPermissions } from './enums';

export function isPdfDocument(filePath: string): Promise<boolean> {
  const options = {
    source: filePath
  };

  return protegoPdfProxy.executeCall<boolean>('IsPdfDocument', options);
}

export function isProtected(filePath: string): Promise<boolean> {
  const options = {
    source: filePath
  };

  return protegoPdfProxy.executeCall<boolean>('IsProtected', options);
}

export function protect(
  source: string,
  target: string,
  password: string,
  protection: PdfProtectionOptions): Promise<boolean> {

  const options = {
    source,
    target,
    password,
    userPassword: protection.userPassword,
    ownerPassword: protection.ownerPassword,
    permissions: protection.permissions,
    encryptionLevel: protection.encryptionMode | protection.encryptionOption,
  };

  return protegoPdfProxy.executeCall('Protect', options);
}

export function unlock(source: string, target: string, password: string): Promise<boolean> {
  const options = {
    source,
    target,
    password,
  };

  return protegoPdfProxy.executeCall('Unlock', options);
}
