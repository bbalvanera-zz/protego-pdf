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

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ProtegoPdf.Properties;

namespace ProtegoPdf.Service
{
    public class OperationResult
    {
        public bool Success { get; set; }

        public string ErrorType { get; set; }

        public string ErrorDescription { get; set; }

        public dynamic Result { get; set; }


        internal string ToJson()
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            return JsonConvert.SerializeObject(this, settings);
        }

        internal static OperationResult Successful(dynamic result = null) => new OperationResult
        {
            Success = true,
            Result = result
        };

        internal static OperationResult InvalidArgument() => new OperationResult
        {
            Success = false,
            ErrorType = Strings.Operation_InvalidArgument_Type,
            ErrorDescription = Strings.Operation_InvalidArgument_Description
        };

        internal static OperationResult GeneralFailure(string description = null) => new OperationResult
        {
            Success = false,
            ErrorType = Strings.Operation_GeneralError_Type,
            ErrorDescription = description ?? Strings.Operation_GeneralError_Description
        };

        internal static OperationResult BadPassword() => new OperationResult
        {
            Success = false,
            ErrorType = Strings.Operation_BadPassword_Type,
            ErrorDescription = Strings.Operation_BadPassword_Description
        };

        internal static OperationResult FileAccessError(string description = null) => new OperationResult
        {
            Success = false,
            ErrorType = Strings.Operation_FileAccessError_Type,
            ErrorDescription = description ?? Strings.Operation_FileAccessError_Description
        };

        internal static OperationResult InsufficientPermissions(string description = null) => new OperationResult
        {
            Success = false,
            ErrorType = Strings.Operation_InsufficientPermissions_Type,
            ErrorDescription = description ?? Strings.Operation_InsufficientPermissions_Description
        };

        internal static OperationResult NotAPdfDocument() => new OperationResult
        {
            Success = false,
            ErrorType = Strings.Operation_NotAPdfDocument_Type,
            ErrorDescription = Strings.Operation_NotAPdfDocument_Description
        };

        internal static OperationResult InvalidAction() => new OperationResult
        {
            Success = false,
            ErrorType = Strings.Operation_InvalidAction_Type,
            ErrorDescription = Strings.Operation_InvalidAction_Description
        };
    }
}
