# ProtegoPdf

A csharp/node.js module that enables access to PDF encryption functionality though the use of iText

## Installation

```sh
$ npm install --save protego-pdf
```

## Usage

```js
import * as protegoPdf from 'protego-pdf';

protegoPdf.isPdfDocument('C:\\files\\my-pdf-document.pdf')
  .then((result) => {
    console.log(result); // true
  })
  .catch((error) => {
    console.log(error.errorType);
    console.log(error.errorDescription);
  });
```
## License
MIT [Bernardo Balvanera]()
