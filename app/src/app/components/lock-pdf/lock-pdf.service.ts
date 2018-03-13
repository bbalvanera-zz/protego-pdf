import { Injectable } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { _throw as observableThrow } from 'rxjs/observable/throw';
import { fromPromise as observableFromPromise } from 'rxjs/observable/fromPromise';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { PdfProtectionOptions } from 'protego-pdf-helper';

import { ParsedPath } from 'path';

import { PdfProtectMode } from './classes/pdf-protect-mode.enum';
import { ElectronService } from '../../services/electron.service';
import { PdfProtectService } from '../../services/pdf-protect.service';
import { PasswordAddComponent } from './passwords-dropdown/password-add/password-add.component';

const path = window.require('path');
const LOCKPDF_SESSION_KEY = 'LockPdfComponent.state';

@Injectable()
export class LockPdfService {

  constructor(
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private toastrService: ToastrService,
    private modalService: NgbModal) {
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

  public savePassword(password: string): Observable<void> {
    const modalOpts: NgbModalOptions = {
      size: 'sm'
    };
    const modalRef = this.modalService.open(PasswordAddComponent, modalOpts);
    modalRef.componentInstance.password = password;

    return observableFromPromise(modalRef.result);
  }

  public saveState(model: any): void {
    sessionStorage.setItem(LOCKPDF_SESSION_KEY, JSON.stringify(model));
  }

  public popState(): any {
    const jsonState = sessionStorage.getItem(LOCKPDF_SESSION_KEY);
    sessionStorage.removeItem(LOCKPDF_SESSION_KEY);

    return JSON.parse(jsonState);
  }

  public showSuccessMessage({ title, message }: { title?: string, message?: string }): void {
    this.toastrService.success(message, title);
  }

  public showWarningMessage({ title, message }: { title?: string, message?: string }): void {
    this.toastrService.warning(message, title);
  }

  public showErrorMessage({ title, message }: { title?: string, message?: string }): void {
    this.toastrService.error(message, title);
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
