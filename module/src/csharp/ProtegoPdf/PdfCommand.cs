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

using iText.Kernel;
using iText.Kernel.Crypto;
using ProtegoPdf.Service;
using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using static ProtegoPdf.Service.OperationResult;

namespace ProtegoPdf
{
    public class PdfCommand
    {
        private readonly PdfService service;
        private readonly MethodInfo command;

        public PdfCommand(PdfCommandName name) : this()
        {
            this.command = GetCommand(name);
        }

        public PdfCommand()
        {
            this.service = new PdfService();
        }

        public async Task<OperationResult> Execute(PdfOptions options)
        {
            if (command == null)
            {
                throw new InvalidOperationException();
            }

            var result = (Task<OperationResult>)command.Invoke(this, new object[] { options });
            return await result;
        }

        public async Task<OperationResult> IsPdfDocument(PdfOptions options)
        {
            var fileName = options.Source;

            if (string.IsNullOrWhiteSpace(fileName) || !File.Exists(fileName))
            {
                return InvalidArgument();
            }

            try
            {
                var result = await Task.Run(() => service.PdfDocument(fileName));
                return Successful(result);
            }
            catch (IOException ex)
            {
                return FileAccessError(ex.Message);
            }
            catch (SystemException ex) when (ex is UnauthorizedAccessException || ex is NotSupportedException)
            {
                return InsufficientPermissions(ex.Message);
            }
            catch (Exception ex)
            {
                return GeneralFailure(ex.Message);
            }
        }

        public async Task<OperationResult> IsProtected(PdfOptions options)
        {
            string fileName = options.Source;

            if (string.IsNullOrWhiteSpace(fileName) || !File.Exists(fileName))
            {
                return InvalidArgument();
            }

            var opResult = await IsPdfDocument(options);

            if (opResult.Success && opResult.Result == false)
            {
                return NotAPdfDocument();
            }
            else if (!opResult.Success && !string.IsNullOrEmpty(opResult.ErrorType))
            {
                return opResult;
            }

            try
            {
                var result = await Task.Run(() => service.Protected(fileName));
                return Successful(result);
            }
            catch (IOException ex)
            {
                return FileAccessError(ex.Message);
            }
            catch (Exception ex) when (ex is PdfException || ex is NullReferenceException || ex is iText.IO.IOException)
            {
                return InvalidArgument();
            }
            catch (Exception ex)
            {
                return GeneralFailure(ex.Message);
            }
        }

        public async Task<OperationResult> Protect(PdfOptions options)
        {
            try
            {
                if (!ValidProtectOptions(options))
                {
                    return InvalidArgument();
                }

                await Task.Run(() => service.Protect(options));
                return Successful();
            }
            catch (BadPasswordException)
            {
                return BadPassword();
            }
            catch (IOException ex)
            {
                return FileAccessError(ex.Message);
            }
            catch (SystemException ex) when (ex is UnauthorizedAccessException || ex is NotSupportedException)
            {
                return InsufficientPermissions(ex.Message);
            }
            catch (Exception ex)
            {
                return GeneralFailure(ex.Message);
            }
        }

        public async Task<OperationResult> Unlock(PdfOptions options)
        {
            try
            {
                if (!ValidUnlockRequest(options))
                {
                    return InvalidArgument();
                }

                await Task.Run(() => service.Unlock(options));
                return Successful();
            }
            catch (BadPasswordException)
            {
                return BadPassword();
            }
            catch (IOException ex)
            {
                return FileAccessError(ex.Message);
            }
            catch (SystemException ex) when (ex is UnauthorizedAccessException || ex is NotSupportedException)
            {
                return InsufficientPermissions(ex.Message);
            }
            catch (Exception ex)
            {
                return GeneralFailure(ex.Message);
            }
        }

        private MethodInfo GetCommand(PdfCommandName command)
        {
            var type = GetType();
            var method = type.GetMethod(command.ToString());

            if (method == null)
            {
                throw new NotImplementedException();
            }

            return method;
        }

        private bool ValidProtectOptions(PdfOptions options)
        {
            if (!ValidOptions(options))
                return false;

            // when protecting a document, userPassword in mandatory
            if (string.IsNullOrWhiteSpace(options.UserPassword))
                return false;

            return true;
        }

        private bool ValidUnlockRequest(PdfOptions options)
        {
            if (!ValidOptions(options))
                return false;

            // when unlocking a document, password is mandatory
            if (string.IsNullOrWhiteSpace(options.Password))
                return false;

            return true;
        }

        private bool ValidOptions(PdfOptions options)
        {
            if (string.IsNullOrWhiteSpace(options.Source))
                return false;

            if (!File.Exists(options.Source))
                return false;

            if (string.IsNullOrWhiteSpace(options.Target))
                return false;

            try
            {
                var path = Path.GetDirectoryName(options.Target);

                if (!Directory.Exists(path))
                    return false;
            }
            catch (NotSupportedException)
            {
                return false;
            }

            if (!service.PdfDocument(options.Source))
                return false;

            return true;
        }
    }
}
