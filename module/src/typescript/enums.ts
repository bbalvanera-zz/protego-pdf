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
