using System;
using System.Collections.Generic;
using System.Text;

namespace ProtegoPdf.Service
{
    public class PdfOptions
    {
        public string Source { get; set; }

        public string Target { get; set; }

        public string Password { get; set; }

        public string UserPassword { get; set; }

        public string OwnerPassword { get; set; }

        public int? Permissions { get; set; }

        public int? EncryptionLevel { get; set; }

        internal byte[] PasswordArray
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Password))
                    return null;

                return Encoding.UTF8.GetBytes(Password);
            }
        }

        internal byte[] UserPasswordArray
        {
            get
            {
                if (string.IsNullOrWhiteSpace(UserPassword))
                    return null;

                return Encoding.UTF8.GetBytes(UserPassword);
            }
        }

        internal byte[] OwnerPasswordArray
        {
            get
            {
                if (string.IsNullOrWhiteSpace(OwnerPassword))
                    return null;

                return Encoding.UTF8.GetBytes(OwnerPassword);
            }
        }

        public static bool TryParse(dynamic request, out PdfOptions result)
        {
            result = null;
            var values = request as IDictionary<string, object>;

            if (values == null)
            {
                result = null;
                return false;
            }

            try
            {
                result = new PdfOptions
                {
                    Source          = values.ContainsKey("source") ? (string)values["source"] : null,
                    Target          = values.ContainsKey("target") ? (string)values["target"] : null,
                    Password        = values.ContainsKey("password") ? (string)values["password"] : null,
                    UserPassword    = values.ContainsKey("userPassword") ? (string)values["userPassword"] : null,
                    OwnerPassword   = values.ContainsKey("ownerPassword") ? (string)values["ownerPassword"] : null,
                    Permissions     = values.ContainsKey("permissions") ? (int)values["permissions"] : (int?)null,
                    EncryptionLevel = values.ContainsKey("encryptionLevel") ? (int)values["encryptionLevel"] : (int?)null,
                };
                return true;
            }
            catch (InvalidCastException)
            {
                return false;
            }
        }
    }
}
