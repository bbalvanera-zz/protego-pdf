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

import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';

import { FileInputComponent, IFileInput } from '../../shared/components/file-input';
import { PdfProtectMode } from '../../shared/pdf-protect-mode.enum';
import { PdfProtectService } from '../../services/pdf-protect.service';
import { UIMessagesDirective } from '../../shared/directives';
import { UnlockPdfService } from './unlock-pdf.service';
import { Logger } from '../../shared/logging/logger';

@Component({
  selector: 'app-unlock-pdf',
  templateUrl: './unlock-pdf.component.html',
  styleUrls: ['./unlock-pdf.component.scss'],
  providers: [UnlockPdfService]
})
export class UnlockPdfComponent implements OnInit {
  @ViewChild(FileInputComponent)
  private fileInput: IFileInput;
  @ViewChild(UIMessagesDirective)
  private uiMessages: UIMessagesDirective;
  private unsubscriber: Subject<void>;

  public password: FormControl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private unlockPdfService: UnlockPdfService,
    private zone: NgZone) {
      this.unsubscriber = new Subject();
      this.password = new FormControl('', Validators.required);
  }

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(params => {
        if (params.fileName) {
          this.fileInput.setValue(params.fileName);
        }
      });
  }

  public protectedStatusChanges(event: { status: string, fileName: string }): void {
    if (event.status === 'unprotected') {
      this.router.navigate(['/'], { queryParams: { fileName: event.fileName } });
    }
  }

  public unlockDocument(mode: PdfProtectMode): void {
    if (!this.valid()) {
      return;
    }

    const fileName = this.fileInput.value;
    const password = this.password.value;

    this.unlockPdfService.unlockFile({ fileName, password, mode })
      .subscribe(
        savePath => {
          // use ngZone since this could potentially be called by a different thread (MainProcess thread)
          // usually when `Save As` is selected.
          this.zone.run(() => {
            this.reset();

            const { message } = this.uiMessages.get('Success_Message');
            this.unlockPdfService.showFileSavedMessage(savePath, message);
          });
        },
        err => {
          this.handlerError(err);
        }
      );
  }

  private valid(): boolean {
    this.fileInput.ensureValue();
    this.password.markAsDirty();

    return this.fileInput.valid && this.password.valid;
  }

  private reset(): void {
    this.fileInput.reset();
    this.password.reset();
  }

  private handlerError(err: { errorType: string, errorDescription?: string }): void {
    if (err.errorType === 'Canceled_By_User') {
      return; // when user cancels `Save As` dialog
    }

    switch (err.errorType) {
      case 'File_Access_Error':
        this.fileInput.setAccessError();
      case 'Insufficient_Permissions': // fall-through is intentional
        this.showMessage('error', err.errorType);
        break;
      default:
        Logger.error(`[LockPdf.protectDocument] Error in LockPdfService.protectDocument: ${err.errorDescription}`);
        this.showMessage('error', 'General_Error');
        break;
    }
  }

  private showMessage(type: 'success' | 'error' | 'warning', id: string): void {
    const uiMessage = this.uiMessages.get(id);

    if (!uiMessage) {
      throw Error('Could not find requested message');
    }

    switch (type) {
      case 'success':
        this.unlockPdfService.showSuccessMessage(uiMessage);
        break;
      case 'error':
        this.unlockPdfService.showErrorMessage(uiMessage);
        break;
      case 'warning':
        this.unlockPdfService.showWarningMessage(uiMessage);
        break;
    }
  }
}
