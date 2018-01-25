using iText.IO.Log;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace ProtegoPdf
{
  class Start
    {
        static void Main()
        {
            SetupLogging();

            var process = ProcessAsync();
            process.Wait();
        }

        static async Task ProcessAsync()
        {
            // wait for something to arrive through stdin
            var input = await Console.In.ReadLineAsync();

            if (!TryDeserializeInput(input, out PdfRequest request))
            {
                await Console.Error.WriteLineAsync("Invalid Request");
                return;
            }
            else if (!ValidRequest(request))
            {
                await Console.Error.WriteLineAsync($"Invalid request");
                return;
            }

            try
            {
                var command = new PdfCommand(request.Name);
                var result = await command.Execute(request.Options);

                await Console.Out.WriteLineAsync(result.ToJson());
            }
            catch (Exception ex)
            {
                await Console.Error.WriteLineAsync($"Unexpected exception ocurred: {ex.Message}");
                throw;
            }
        }

        private static bool TryDeserializeInput(string input, out PdfRequest output)
        {
            var retVal = true;

            try
            {
                output = JsonConvert.DeserializeObject<PdfRequest>(input);
            }
            catch (JsonReaderException)
            {
                output = null;
                retVal = false;
            }

            return retVal;
        }

        private static bool ValidRequest(PdfRequest request)
        {
            bool retVal = true;

            if (request == null)
            {
                retVal = false;
            }
            else if (request.Name == PdfCommandName.None)
            {
                retVal = false;
            }
            else if (request.Options == null || string.IsNullOrWhiteSpace(request.Options.Source))
            {
                retVal = false;
            }

            return retVal;
        }

        private static void SetupLogging()
        {
            // this is required by iText.
            // If it is not set here, their code will invoke Console.Error causing the client to fail.
            LoggerFactory.BindFactory(new NoOpLoggerFactory());
        }
    }
}
