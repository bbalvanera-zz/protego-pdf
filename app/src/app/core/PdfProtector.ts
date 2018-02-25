import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { PdfProtectMode } from './PdfProtectMode';
import { ServiceLocator } from './ServiceLocator';
import { PdfProtectService } from '../services/pdf-protect.service';
import { ElectronService } from '../services/electron.service';
import { PdfProtectionOptions } from 'protego-pdf-helper';

const path = window.require('path');

export class PdfProtector {
  private pdfProtectService: PdfProtectService;
  private electronService: ElectronService;

  public readonly name: string;
  public readonly nameWithoutExtension: string;
  public readonly extension: string;
  public readonly directoryName: string;
  public readonly fullName: string;

  constructor(private fileName: string) {
    if (!fileName || fileName.trim().length === 0) {
      throw Error('Invalid argument');
    }

    this.pdfProtectService = ServiceLocator.get(PdfProtectService);
    this.electronService = ServiceLocator.get(ElectronService);

    this.extension = path.extname(fileName);
    this.nameWithoutExtension = path.basename(fileName, this.extension);
    this.name = path.basename(fileName);
    this.directoryName = path.dirname(fileName);
    this.fullName = fileName;
  }

  public protect(password: string, mode: PdfProtectMode): Observable<boolean> {
    return this.getTargetFileName(mode)
      .pipe(mergeMap(target => {
        const source = this.fileName;
        const opts: PdfProtectionOptions = {
          userPassword: password,
          encryptionMode: 2, // aes128,
          permissions: 3900 // all permissions. Only ask for 'open document' password, nothing else
        };

        return this.pdfProtectService.protect(source, target, undefined, opts);
      }));
  }

  private getTargetFileName(mode: PdfProtectMode): Observable<string> {
    let retVal: Observable<string>;

    switch (mode) {
      case PdfProtectMode.overwrite:
        retVal = of(this.fileName);
        break;
      case PdfProtectMode.saveNew:
        retVal = of(path.join(this.directoryName, `${this.nameWithoutExtension}.locked${this.extension}`));
        break;
      case PdfProtectMode.saveAs:
        retVal = this.electronService.getSavePath();
        break;
    }

    return retVal;
  }
}
