using ProtegoPdf.Service;

namespace ProtegoPdf
{
    public class PdfRequest
    {
        public PdfCommandName Name { get; set; }

        public PdfOptions Options { get; set; }
    }
}
