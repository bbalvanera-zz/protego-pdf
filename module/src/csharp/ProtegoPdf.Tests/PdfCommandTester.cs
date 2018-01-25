using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProtegoPdf.Service;
using System.IO;
using System.Threading.Tasks;

namespace ProtegoPdf.Tests
{
    public class PdfCommandTester
    {
        public static PdfCommand GetTarget() => new PdfCommand();

        [TestClass]
        public class When_checking_If_PdfDocument
        {

            [TestMethod]
            public async Task Should_return_OperationResult_Type()
            {
                var subject = GetTarget();

                var result = await subject.IsPdfDocument(new Service.PdfOptions { Source = "file.pdf" }); // any file works
                
                Assert.IsInstanceOfType(result, typeof(OperationResult));
            }

            [DataTestMethod]
            [DataRow("TestData/test.v1.2.clear.pdf")]
            [DataRow("TestData/test.v1.2.encrypted[test].pdf")]
            [DataRow("TestData/test.v1.6.restricted[][test].pdf")]
            public async Task Should_succeed_on_valid_file(string f)
            {
                var subject = GetTarget();

                var result = await subject.IsPdfDocument(new PdfOptions { Source = f });

                Assert.IsTrue(result.Success);
                Assert.IsTrue(result.Result);
                Assert.IsNull(result.ErrorType);
            }

            [DataTestMethod]
            [DataRow(null)]
            [DataRow("")]
            [DataRow("gasdfas;rj")]
            [DataRow("TestData/not-exists.pdf")]
            [DataRow("1")]
            public async Task Should_fail_on_invalid_argument(string f)
            {
                var subject = GetTarget();

                var result = await subject.IsPdfDocument(new PdfOptions { Source = f });

                Assert.AreEqual("Invalid_Argument", result.ErrorType);
                Assert.IsFalse(result.Success);
                Assert.IsNull(result.Result);
            }

            [DataTestMethod]
            [DataRow("TestData/test.corrupted.pdf")]
            [DataRow("TestData/test.v1.5.corrupted.pdf")]
            [DataRow("TestData/test.v1.5.invalid.pdf")]
            public async Task Should_succeed_even_if_invalid_file(string f)
            {
                var target = GetTarget();

                var result = await target.IsPdfDocument(new PdfOptions { Source = f });

                Assert.IsTrue(result.Success);
                Assert.IsFalse(result.Result);
                Assert.IsNull(result.ErrorType);
            }

            [TestMethod]
            public async Task Should_fail_on_blocked_file()
            {
                string f = "TestData/test.v1.5.clear.pdf";
                
                using (var blocker = File.Open(f, FileMode.Open, FileAccess.Read, FileShare.None))
                {
                    var target = GetTarget();

                    var result = await target.IsPdfDocument(new PdfOptions { Source = f });

                    Assert.AreEqual("File_Access_Error", result.ErrorType);
                    Assert.IsFalse(result.Success);
                    Assert.IsNull(result.Result);
                }
            }
        }

        [TestClass]
        public class When_checking_if_Protected
        {
            [TestMethod]
            public async Task Should_return_OperationResult_Type()
            {
                var target = GetTarget();

                var result = await target.IsProtected(new PdfOptions { Source = "file.pdf" });

                Assert.IsInstanceOfType(result, typeof(OperationResult));
            }

            [DataTestMethod]
            [DataRow("TestData/test.v1.2.encrypted[test].pdf")]
            public async Task Should_succeed_on_valid_file(string f)
            {
                var target = GetTarget();

                var result = await target.IsProtected(new PdfOptions { Source = f });

                Assert.IsTrue(result.Success);
                Assert.IsTrue(result.Result);
                Assert.IsNull(result.ErrorType);
            }

            [DataTestMethod]
            [DataRow(null)]
            [DataRow("")]
            [DataRow("gasdfas;rj")]
            [DataRow(@"\:text.txt")]
            [DataRow("TestData/not-exists.pdf")]
            [DataRow("1")]
            public async Task Should_fail_on_invalid_argument(string f)
            {
                var target = GetTarget();

                var result = await target.IsProtected(new PdfOptions { Source = f });

                Assert.AreEqual("Invalid_Argument", result.ErrorType);
                Assert.IsFalse(result.Success);
                Assert.IsNull(result.Result);
            }

            [DataTestMethod]
            [DataRow("TestData/test.v1.5.corrupted.pdf")]
            [DataRow("TestData/test.v1.5.invalid.pdf")]
            public async Task Should_fail_on_invalid_file(string f)
            {
                var target = GetTarget();

                var result = await target.IsProtected(new PdfOptions { Source = f });

                Assert.IsFalse(result.Success);
                Assert.IsNull(result.Result);
                Assert.AreEqual("Not_A_Pdf_Document", result.ErrorType);
            }

            [TestMethod]
            public async Task Should_fail_if_blocked_file()
            {
                string f = "TestData/test.v1.4.clear.pdf";
                using (var blocker = File.Open(f, FileMode.Open, FileAccess.Read, FileShare.None))
                {
                    var target = GetTarget();

                    var result = await target.IsPdfDocument(new PdfOptions { Source = f });

                    Assert.AreEqual("File_Access_Error", result.ErrorType);
                    Assert.IsFalse(result.Success);
                    Assert.IsNull(result.Result);
                }
            }
        }

        [TestClass]
        public class When_protecting_file
        {
            [DataTestMethod]
            [DataRow("TestData/test.v1.2.clear.pdf")]
            [DataRow("TestData/test.v1.3.clear.pdf")]
            [DataRow("TestData/test.v1.4.clear.pdf")]
            [DataRow("TestData/test.v1.5.clear.pdf")]
            [DataRow("TestData/test.v1.6.clear.pdf")]
            public async Task Should_create_protected_copy(string sourceFile)
            {
                var targetFile = $"{sourceFile}.encrypted.pdf";
                var request = new PdfOptions
                {
                    Source = sourceFile,
                    Target = targetFile,
                    UserPassword = "hello!"
                };
                var target = GetTarget();

                var result = await target.Protect(request);

                Assert.IsTrue(result.Success);
                Assert.IsTrue(File.Exists(targetFile));

                result = await target.IsProtected(new PdfOptions { Source = targetFile });
                Assert.IsTrue(result.Success);
                Assert.IsTrue(result.Result);
                File.Delete(targetFile);
            }

            [DataTestMethod]
            [DataRow("TestData/test.v1.2.clear.pdf")]
            [DataRow("TestData/test.v1.3.clear.pdf")]
            [DataRow("TestData/test.v1.4.clear.pdf")]
            [DataRow("TestData/test.v1.5.clear.pdf")]
            [DataRow("TestData/test.v1.6.clear.pdf")]
            public async Task Should_protect_existing_file(string sourceFile)
            {
                var targetFile = $"{sourceFile}.encrypted.pdf";
                try
                {
                    File.Copy(sourceFile, targetFile, true); // source is a clean file, copy it and avoid overwriting orinal one
                    var request = new PdfOptions
                    {
                        Source = targetFile,
                        Target = targetFile,
                        UserPassword = "hello!"
                    };
                    var target = GetTarget();
                    var result = await target.IsProtected(new PdfOptions { Source = targetFile });
                    Assert.IsFalse(result.Result); // make sure to start with an unprotected file.

                    result = await target.Protect(request);

                    Assert.IsTrue(result.Success);
                    Assert.IsTrue(File.Exists(targetFile));

                    result = await target.IsProtected(new PdfOptions { Source = targetFile });
                    Assert.IsTrue(result.Success);
                    Assert.IsTrue(result.Result);
                }
                finally
                {
                    if (File.Exists(targetFile))
                        File.Delete(targetFile);
                }
            }

            [TestMethod]
            public async Task Should_fail_if_insufficient_permissions()
            {
                var sourceFile = "TestData/test.v1.2.clear.pdf";
                var targetFile = "C:\\Program Files\\mytestfile.encrypted.pdf";

                var request = new PdfOptions
                {
                    Source = sourceFile,
                    Target = targetFile,
                    UserPassword = "hello!"
                };
                var target = GetTarget();

                var result = await target.Protect(request);

                Assert.IsFalse(result.Success);
                Assert.AreEqual("Insufficient_Permissions", result.ErrorType);
            }

            [DataTestMethod]
            [DataRow(@"D:\AppDataz\testdata.pdf")]
            [DataRow(@"P:\testdata.pdf")]
            public async Task Should_fail_if_invalid_path(string targetFile)
            {
                var sourceFile = "TestData/test.v1.2.clear.pdf";


                var request = new PdfOptions
                {
                    Source = sourceFile,
                    Target = targetFile,
                    UserPassword = "hello!"
                };
                var target = GetTarget();

                var result = await target.Protect(request);

                Assert.IsFalse(result.Success);
                Assert.AreEqual("Invalid_Argument", result.ErrorType);
            }

            [DataTestMethod]
            [DataRow(@":\text.txt")]
            [DataRow(@":text.txt")]
            public async Task Should_fail_if_illegal_path(string targetFile)
            {
                var sourceFile = "TestData/test.v1.2.clear.pdf";

                var request = new PdfOptions
                {
                    Source = sourceFile,
                    Target = targetFile,
                    UserPassword = "hello!"
                };
                var target = GetTarget();

                var result = await target.Protect(request);

                Assert.IsFalse(result.Success);
                Assert.AreEqual("Invalid_Argument", result.ErrorType);
            }
        }
    }
}
