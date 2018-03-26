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
import { _throw as observableThrow } from 'rxjs/observable/throw';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { ParsedPath } from 'path';

import { PdfProtectMode } from '../../shared/pdf-protect-mode.enum';
import { ElectronService } from '../../services/electron.service';
import { PdfProtectService } from '../../services/pdf-protect.service';
import { StorageService } from '../../services/storage.service';
import { PdfComponentService } from '../../services/pdf-component.service';

const path = window.require('path');
const fs   = window.require('fs');

@Injectable()
export class UnlockPdfService extends PdfComponentService {

  constructor(
    toastrService: ToastrService,
    electronService: ElectronService,
    storageService: StorageService,
    private pdfService: PdfProtectService) {
      super(electronService, storageService, toastrService);
  }

  public unlockFile(args: { fileName: string, password: string, mode: PdfProtectMode }): Observable<string> {
    const fileInfo = path.parse(args.fileName) as ParsedPath;

    return this.getTargetFileName(fileInfo, args.mode)
      .pipe(mergeMap(target => {
        if (!target || target === '') { // if user cancels save-file dialog, an empty file path is returned
          return observableThrow({ errorType: 'Canceled_By_User' });
        }

        const source = args.fileName;
        const password = args.password;

        return this.pdfService
          .unlock(source, target, password)
          .pipe(map(_ => target));
      }));
  }
}
