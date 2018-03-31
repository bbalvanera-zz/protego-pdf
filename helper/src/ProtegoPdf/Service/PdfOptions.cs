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
