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

using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProtegoPdf.Service;
using System.IO;
using System.Threading.Tasks;

namespace ProtegoPdf.Tests
{
    public class PdfCommandTester
    {
        public static PdfCommand GetSubject() => new PdfCommand();

        [TestClass]
        public class When_checking_If_PdfDocument
        {

            [TestMethod]
            public async Task Should_return_OperationResult_Type()
            {
                var subject = GetSubject();

                var result = await subject.IsPdfDocument(new Service.PdfOptions { Source = "file.pdf" }); // any file works

                Assert.IsInstanceOfType(result, typeof(OperationResult));
            }

            [DataTestMethod]
            [DataRow("TestData/test.v1.2.clear.pdf")]
            [DataRow("TestData/test.v1.2.encrypted[test].pdf")]
            [DataRow("TestData/test.v1.6.restricted[][test].pdf")]
            public async Task Should_succeed_on_valid_file(string f)
            {
                var subject = GetSubject();

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
                var subject = GetSubject();

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
                // if the file is invalid, it should return false to IsPdfDocument
                // but no exceptions should be thrown
                var subject = GetSubject();

                var result = await subject.IsPdfDocument(new PdfOptions { Source = f });

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
                    var subject = GetSubject();

                    var result = await subject.IsPdfDocument(new PdfOptions { Source = f });

                    Assert.AreEqual("File_Access_Error", result.ErrorType);
                    Assert.IsFalse(result.Success);
                    Assert.IsNull(result.Result);
                }
            }

            [TestMethod]
            [Description("Make this test work by denying all permissions at the OS level for this file")]
            [Ignore]
            public async Task Should_fail_if_no_access_to_file()
            {
                string f = "TestData/test.v1.6.permission.denied.pdf";

                var subject = GetSubject();

                var result = await subject.IsPdfDocument(new PdfOptions { Source = f });

                Assert.IsFalse(result.Success);
                Assert.AreEqual("Insufficient_Permissions", result.ErrorType);
            }
        }

        [TestClass]
        public class When_checking_if_Protected
        {
            [TestMethod]
            public async Task Should_return_OperationResult_Type()
            {
                var subject = GetSubject();

                var result = await subject.IsProtected(new PdfOptions { Source = "file.pdf" });

                Assert.IsInstanceOfType(result, typeof(OperationResult));
            }

            [DataTestMethod]
            [DataRow("TestData/test.v1.2.encrypted[test].pdf")]
            public async Task Should_succeed_on_valid_file(string f)
            {
                var subject = GetSubject();

                var result = await subject.IsProtected(new PdfOptions { Source = f });

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
                var subject = GetSubject();

                var result = await subject.IsProtected(new PdfOptions { Source = f });

                Assert.AreEqual("Invalid_Argument", result.ErrorType);
                Assert.IsFalse(result.Success);
                Assert.IsNull(result.Result);
            }

            [DataTestMethod]
            [DataRow("TestData/test.v1.5.corrupted.pdf")]
            [DataRow("TestData/test.v1.5.invalid.pdf")]
            public async Task Should_fail_on_invalid_file(string f)
            {
                var subject = GetSubject();

                var result = await subject.IsProtected(new PdfOptions { Source = f });

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
                    var subject = GetSubject();

                    var result = await subject.IsProtected(new PdfOptions { Source = f });

                    Assert.AreEqual("File_Access_Error", result.ErrorType);
                    Assert.IsFalse(result.Success);
                    Assert.IsNull(result.Result);
                }
            }

            [TestMethod]
            [Ignore]
            [Description("Make this test work by denying all permissions at the OS level for this file")]
            public async Task Should_fail_if_no_access_to_file()
            {
                string f = "TestData/test.v1.6.permission.denied.pdf";

                var subject = GetSubject();

                var result = await subject.IsProtected(new PdfOptions { Source = f });

                Assert.IsFalse(result.Success);
                Assert.AreEqual("Insufficient_Permissions", result.ErrorType);
            }
        }

        [TestClass]
        public class When_protecting_file
        {
            [DataTestMethod]
            [DataRow("TestData/test.v1.2.clear.pdf")]
            [DataRow("TestData/test.v1.3.clear.pdf")]
            [DataRow("TestData/test.v1.3.clear2.pdf")]
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
                    UserPassword = "hello!",
                    Permissions = 0xf3c // all permissions granted
                };
                var subject = GetSubject();

                var result = await subject.Protect(request);

                Assert.IsTrue(result.Success);
                Assert.IsTrue(File.Exists(targetFile));

                result = await subject.IsProtected(new PdfOptions { Source = targetFile });
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
                    File.Copy(sourceFile, targetFile, true); // source is a clean file, copy it and avoid overwriting original one
                    var request = new PdfOptions
                    {
                        Source = targetFile,
                        Target = targetFile,
                        UserPassword = "hello!"
                    };
                    var subject = GetSubject();
                    var result = await subject.IsProtected(new PdfOptions { Source = targetFile });
                    Assert.IsFalse(result.Result); // make sure to start with an unprotected file.

                    result = await subject.Protect(request);

                    Assert.IsTrue(result.Success);
                    Assert.IsTrue(File.Exists(targetFile));

                    result = await subject.IsProtected(new PdfOptions { Source = targetFile });
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
                var subject = GetSubject();

                var result = await subject.Protect(request);

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
                var subject = GetSubject();

                var result = await subject.Protect(request);

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
                var subject = GetSubject();

                var result = await subject.Protect(request);

                Assert.IsFalse(result.Success);
                Assert.AreEqual("Invalid_Argument", result.ErrorType);
            }

            [TestMethod]
            public async Task Should_fail_if_blocked_file()
            {
                var sourceFile = "TestData/test.v1.2.clear.pdf";
                var targetFile = $"{sourceFile}.encrypted.pdf";
                try
                {
                    File.Copy(sourceFile, targetFile, true); // source is a clean file, copy it and avoid overwriting original one
                    var request = new PdfOptions
                    {
                        Source = targetFile,
                        Target = targetFile,
                        UserPassword = "hello!"
                    };
                    var subject = GetSubject();
                    var result = await subject.IsProtected(new PdfOptions { Source = targetFile });
                    Assert.IsFalse(result.Result); // make sure to start with an unprotected file.

                    using (var blocker = File.Open(targetFile, FileMode.Open, FileAccess.ReadWrite, FileShare.None))
                    {
                        result = await subject.Protect(request);

                        Assert.IsFalse(result.Success);
                        Assert.AreEqual("File_Access_Error", result.ErrorType);
                    }
                }
                finally
                {
                    if (File.Exists(targetFile))
                        File.Delete(targetFile);
                }
            }

            [TestMethod]
            [Ignore]
            [Description("Make this test work by denying all permissions at the OS level for this file")]
            public async Task Should_fail_if_no_access_to_file()
            {
                string f = "TestData/test.v1.6.permission.denied.pdf";
                var request = new PdfOptions
                {
                    Source = f,
                    Target = f,
                    UserPassword = "hello!"
                };
                var subject = GetSubject();

                var result = await subject.Protect(request);

                Assert.IsFalse(result.Success);
                Assert.AreEqual("Insufficient_Permissions", result.ErrorType);
            }
        }
    }
}
