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

import { Proxy } from './proxy';
import { ProtectionOptions } from './protection-options';
import { HelperOptions } from './helper-options';
import { OperationResult } from './operation-result';

export { ProtectionOptions } from './protection-options';
export { EncryptionMode, EncryptionOption, PdfPermissions } from './enums';

export function isPdfDocument(filePath: string): Promise<boolean> {
  const options = {
    source: filePath
  };

  return Proxy.executeCall<boolean>('IsPdfDocument', options);
}

export function isProtected(filePath: string): Promise<boolean> {
  const options = {
    source: filePath
  };

  return Proxy.executeCall<boolean>('IsProtected', options);
}

export function protect(
  source: string,
  target: string,
  password: string,
  protection: ProtectionOptions): Promise<boolean> {

  const options = {
    source,
    target,
    password,
    userPassword: protection.userPassword,
    ownerPassword: protection.ownerPassword,
    permissions: protection.permissions,
    /*tslint:disable:no-bitwise*/
    encryptionLevel: protection.encryptionMode | protection.encryptionOption,
  };

  return Proxy.executeCall('Protect', options);
}

export function unlock(source: string, target: string, password: string): Promise<boolean> {
  const options = {
    source,
    target,
    password,
  };

  return Proxy.executeCall('Unlock', options);
}
