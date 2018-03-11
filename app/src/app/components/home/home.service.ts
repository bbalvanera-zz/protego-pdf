import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { _throw as observableThrow } from 'rxjs/observable/throw';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { PdfProtectionOptions } from 'protego-pdf-helper';

import { ParsedPath } from 'path';

import { PdfProtectMode } from './classes/pdf-protect-mode.enum';
import { ElectronService } from '../../services/electron.service';
import { PdfProtectService } from '../../services/pdf-protect.service';

const path = window.require('path');
const HOME_SESSION_KEY = 'HomeComponent.state';

@Injectable()
export class HomeService {

  constructor(
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private toastrService: ToastrService) {
  }

  public selectFile(): Observable<string> {
    return this.electronService.selectFile()
      .pipe(
        filter(files => files && files.length > 0),
        map(files => files[0])
      );
  }

  public protectFile(fileName: string, password: string, mode: PdfProtectMode): Observable<boolean> {
    const fileInfo = path.parse(fileName) as ParsedPath;

    return this.getTargetFileName(fileInfo, mode)
      .pipe(mergeMap(target => {
        if (!target || target === '') { // if user cancels save-file dialog, an empty file path is returned
          return observableThrow({ errorType: 'Canceled_By_User' });
        }

        const source = fileName;
        const opts: PdfProtectionOptions = {
          userPassword: password,
          encryptionMode: 2, // aes128,
          permissions: 3900 // all permissions. Only ask for 'open document' password, nothing else
        };

        return this.pdfService.protect(source, target, undefined, opts);
      }));
  }

  public saveState(model: any): void {
    sessionStorage.setItem(HOME_SESSION_KEY, JSON.stringify(model));
  }

  public popState(): any {
    const jsonState = sessionStorage.getItem(HOME_SESSION_KEY);
    sessionStorage.removeItem(HOME_SESSION_KEY);

    return JSON.parse(jsonState);
  }

  public showErrorMessage({ title, message }: { title?: string, message?: string }): void {
    this.toastrService.error(message, title);
  }

  public showSuccessMessage({ title, message }: { title?: string, message?: string }): void {
    this.toastrService.success(message, title);
  }

  private getTargetFileName(fileInfo: ParsedPath, mode: PdfProtectMode): Observable<string> {
    let retVal: Observable<string>;

    switch (mode) {
      case PdfProtectMode.overwrite:
        retVal = observableOf(path.join(fileInfo.dir, fileInfo.base));
        break;
      case PdfProtectMode.saveNew:
        const newName = `${fileInfo.name}.locked${fileInfo.ext}`;
        retVal = observableOf(path.join(fileInfo.dir, newName));
        break;
      case PdfProtectMode.saveAs:
        retVal = this.electronService.getSavePath();
        break;
    }

    return retVal;
  }
}
