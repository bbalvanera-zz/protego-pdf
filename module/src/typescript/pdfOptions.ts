import { PdfProtectionOptions } from './pdfProtectionOptions';

export interface PdfOptions extends PdfProtectionOptions {
  source: string;
  target?: string;
  password?: string;
}
