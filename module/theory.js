// just a quick way to prove a "theory"
__dirname.toString();
process.versions.electron = '1.7.10';
const isPdfDocument = require('./lib/').isPdfDocument;

isPdfDocument('./tests/test-data/test.corrupted.pdf')
  .then((result) => {
    console.log(result);
  })
  .catch((reason) => {
    console.log(reason);
  });
