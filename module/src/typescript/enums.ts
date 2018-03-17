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

export enum EncryptionMode {
  standard40,
  standard128,
  aes128,
  aes256
}

export enum EncryptionOption {
  encryptAll,
  encryptAllExceptMetadata,
  encrytpEmbeddedFileOnly
}
// flags
export enum PdfPermissions {
  allowLoResPrinting = 0x4,
  allowModifyContents = 0x8,
  allowCopyContents = 0x10,
  allowModifyAnnotations = 0x20,
  allowFormFillIn = 0x100,
  allowScreenReaders = 0x200,
  allowAssembly = 0x400,
  allowHiResPrinting = 0x800 | allowLoResPrinting
}
