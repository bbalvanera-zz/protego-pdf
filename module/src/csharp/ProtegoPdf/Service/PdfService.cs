using iText.Kernel;
using iText.Kernel.Crypto;
using iText.Kernel.Pdf;
using System;
using System.IO;

namespace ProtegoPdf.Service
{
    internal class PdfService
    {
        public bool PdfDocument(string fileName)
        {
            try
            {
                ForceRead(fileName);
                return true;
            }
            catch (BadPasswordException)
            {
                // Looks like a valid file that could not be opened because it is encrypted but valid nonetheless.
                return true;
            }
            catch (Exception ex) when (ex is PdfException || ex is NullReferenceException || ex is iText.IO.IOException)
            {
                return false;
            }
        }

        public bool Protected(string fileName)
        {
            try
            {
                ForceRead(fileName);
                return false;
            }
            catch (BadPasswordException)
            {
                return true;
            }
        }

        public void Protect(PdfOptions args)
        {
            var tempTarget  = Path.GetTempFileName();

            var reader      = new PdfReader(args.Source, new ReaderProperties().SetPassword(args.PasswordArray));
            var permissions = args.Permissions ?? unchecked((int)reader.GetPermissions());
            var encryption  = args.EncryptionLevel ?? reader.GetCryptoMode();

            // reader.GetCryptoMode() returns -1 when no encryption is set and this is not a valid encryption.
            // use AES 128 encryption by default.
            encryption = encryption != -1 ? encryption : EncryptionConstants.ENCRYPTION_AES_128;

            var writer = new PdfWriter(tempTarget, new WriterProperties().SetStandardEncryption(
                args.UserPasswordArray,
                args.OwnerPasswordArray ?? args.UserPasswordArray,
                permissions,
                encryption)
            );

            var doc = new PdfDocument(reader, writer);
            doc.SetCloseReader(true);
            doc.SetCloseWriter(true);

            doc.Close();

            File.Copy(tempTarget, args.Target, true);
            File.Delete(tempTarget);
        }

        public void Unlock(PdfOptions args)
        {
            var reader = new PdfReader(args.Source, new ReaderProperties().SetPassword(args.PasswordArray));
            var writer = new PdfWriter(args.Target);

            var doc = new PdfDocument(reader, writer);
            doc.SetCloseReader(true);
            doc.SetCloseWriter(true);

            doc.Close();
        }

        private void ForceRead(string fileName)
        {
            using (var file = File.Open(fileName, FileMode.Open, FileAccess.Read, FileShare.Delete))
            {
                using (var reader = new PdfReader(file))
                {
                    using (var doc = new PdfDocument(reader))
                    {

                        if (!reader.IsOpenedWithFullPermission())
                            throw new BadPasswordException("Bad Password");
                    }
                }
            }

            GC.Collect();
        }
    }
}
