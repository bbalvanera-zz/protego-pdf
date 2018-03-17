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
