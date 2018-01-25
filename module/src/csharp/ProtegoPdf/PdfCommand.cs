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

            var isPdf = await IsPdfDocument(options);

            if (!(isPdf.Success && isPdf.Result))
            {
                return NotAPdfDocument();
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
            if (!ValidProtectOptions(options))
            {
                return InvalidArgument();
            }

            try
            {
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
            if (!ValidUnlockRequest(options))
            {
                return InvalidArgument();
            }

            try
            {
                await Task.Run(() => service.Unlock(options));
                return Successful();
            }
            catch (BadPasswordException)
            {
                return BadPassword();
            }
            catch (Exception ex)
            {
                return GeneralFailure(ex.Message);
            }
        }
        
        private MethodInfo GetCommand(PdfCommandName command)
        {
            var type   = GetType();
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
