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
import { ElectronService } from '../../shared/services/electron.service';
import { PdfProtectService } from '../../shared/services/pdf-protect.service';
import { StorageService } from '../../shared/services/storage.service';
import { PasswordAddComponent } from './passwords-dropdown/password-add/password-add.component';
import { LockSuccessToastrComponent } from './lock-success-toastr/lock-success-toastr.component';

const path = window.require('path');
const fs   = window.require('fs');

@Injectable()
export class LockPdfService {

  constructor(
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private storageService: StorageService,
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

  public protectFile(fileName: string, password: string, mode: PdfProtectMode): Observable<string> {
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

        return this.pdfService
          .protect(source, target, undefined, opts)
          .pipe(map(_ => target));
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
    this.storageService.setLockPdfState(model);
  }

  public popState(): any {
    return this.storageService.popLockPdfState();
  }

  public showFileSavedMessage(saveLocation: string, message: string): void {
    this.storageService.setLockPdfDir(saveLocation);
    this.toastrService.success(message, undefined, { toastComponent: LockSuccessToastrComponent });
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
        const newFile = this.getUnusedFilename(fileInfo);

        retVal = observableOf(newFile);
        break;
      case PdfProtectMode.saveAs:
        retVal = this.electronService.getSavePath();
        break;
    }

    return retVal;
  }

  private getUnusedFilename(fileInfo: ParsedPath): string {
    let fileName = `${fileInfo.name}.locked${fileInfo.ext}`;
    let unusedFile = path.join(fileInfo.dir, fileName);
    let count = 1;

    if (!fs.existsSync(unusedFile)) {
      return unusedFile;
    }

    do {
      fileName = `${fileInfo.name}.locked (${count})${fileInfo.ext}`;
      unusedFile = path.join(fileInfo.dir, fileName);
      count++;
    } while (fs.existsSync(unusedFile));

    return unusedFile;
  }
}
