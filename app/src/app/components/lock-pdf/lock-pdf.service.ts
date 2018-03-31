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
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { _throw as observableThrow } from 'rxjs/observable/throw';
import { fromPromise as observableFromPromise } from 'rxjs/observable/fromPromise';
import { ParsedPath } from 'path';
import { ProtectionOptions } from '../../../modules/protego-pdf-helper';

import { PasswordAddComponent } from './passwords-dropdown/password-add/password-add.component';
import { PdfProtectMode } from '../../shared/pdf-protect-mode.enum';
import { PdfProtectService } from '../../services/pdf-protect.service';
import { StorageService } from '../../services/storage.service';
import { ElectronService } from '../../services/electron.service';
import { PdfComponentService } from '../../services/pdf-component.service';

const path = window.require('path');
const fs   = window.require('fs');

@Injectable()
export class LockPdfService extends PdfComponentService {

  constructor(
    toastrService: ToastrService,
    electronService: ElectronService,
    storageService: StorageService,
    private pdfService: PdfProtectService,
    private modalService: NgbModal) {
      super(electronService, storageService, toastrService);
  }

  public selectFile(): Observable<string> {
    return this.electronService.selectFile()
      .pipe(
        filter(files => files && files.length > 0),
        map(files => files[0])
      );
  }

  public protectFile(args: { fileName: string, password: string, mode: PdfProtectMode }): Observable<string> {
    const fileInfo = path.parse(args.fileName) as ParsedPath;

    return this.getTargetFileName(fileInfo, args.mode)
      .pipe(mergeMap(target => {
        if (!target || target === '') { // if user cancels save-file dialog, an empty file path is returned
          return observableThrow({ errorType: 'Canceled_By_User' });
        }

        const source = args.fileName;
        const opts: ProtectionOptions = {
          userPassword: args.password,
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
}
