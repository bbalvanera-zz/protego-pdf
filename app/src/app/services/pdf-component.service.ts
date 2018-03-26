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
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { ParsedPath } from 'path';

import { ElectronService } from './electron.service';
import { StorageService } from './storage.service';
import { PdfProtectMode } from '../shared/pdf-protect-mode.enum';
import { SuccessToastrComponent } from '../shared/components/success-toastr/success-toastr.component';

const path = window.require('path');
const fs = window.require('fs');

@Injectable()
export class PdfComponentService {
  constructor(
    protected electronService: ElectronService,
    protected storageService: StorageService,
    protected toastrService: ToastrService) {
  }

  public showFileSavedMessage(saveLocation: string, message: string): void {
    this.storageService.setSuccessDir(saveLocation);
    this.toastrService.success(message, undefined, { toastComponent: SuccessToastrComponent });
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

  protected getTargetFileName(fileInfo: ParsedPath, mode: PdfProtectMode): Observable<string> {
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
