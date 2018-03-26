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

import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';

import { PdfProtectMode } from '../../shared/pdf-protect-mode.enum';
import { LockPdfService } from './lock-pdf.service';
import { IFileInput, FileInputComponent } from '../../shared/components/file-input';
import { IPasswordInput, PasswordInputComponent } from './password-input';
import { PasswordsDropdownComponent } from './passwords-dropdown/passwords-dropdown.component';
import { UIMessagesDirective } from '../../shared/directives/ui-messages.directive';
import { Logger } from '../../shared/logging/logger';

@Component({
  selector: 'app-lock-pdf',
  templateUrl: './lock-pdf.component.html',
  styleUrls: ['./lock-pdf.component.scss'],
  providers: [LockPdfService]
})
export class LockPdfComponent implements OnInit, OnDestroy {

  @ViewChild(FileInputComponent)
  private fileInput: IFileInput;
  @ViewChild(PasswordInputComponent)
  private passwordInput: IPasswordInput;
  @ViewChild(PasswordsDropdownComponent)
  private passwordsDropdown: PasswordsDropdownComponent;
  @ViewChild(UIMessagesDirective)
  private uiMessages: UIMessagesDirective;

  private unsubscriber: Subject<void>;

  constructor(
    private lockPdfService: LockPdfService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone) {
      this.unsubscriber = new Subject<void>();
  }

  public ngOnInit(): void {
    this.loadState();

    this.router.events
      .pipe(
        takeUntil(this.unsubscriber),
        filter(event =>
          event instanceof NavigationStart && !/\/unlock/.test(event.url)
        )
      )
      .subscribe(_ => {
        this.saveState();
      });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(params => {
        if (params.fileName) {
          this.setFileName(params.fileName);
        }

        if (params.pwd) {
          this.setPassword(params.pwd);
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
  }

  public protectDocument(mode: PdfProtectMode): void {
    if (!this.valid()) {
      return;
    }

    const fileName = this.fileInput.value;
    const { password } = this.passwordInput.value;

    this.lockPdfService.protectFile({ fileName, password, mode })
      .subscribe(
        savePath => {
          // use ngZone since this could potentially be called by a different thread (MainProcess thread)
          // usually when `Save As` is selected.
          this.zone.run(() => {
            this.reset();

            const { message } = this.uiMessages.get('Success_Message');
            this.lockPdfService.showFileSavedMessage(savePath, message);
          });
        },
        err => {
          this.handleProtectError(err);
        }
      );
  }

  public savePassword(): void {
    if (!this.passwordInput.valid) {
      this.passwordInput.ensureValue();
      this.showMessage('warning', 'Invalid_Password_To_Save');

      return;
    }

    const { password } = this.passwordInput.value;
    this.lockPdfService.savePassword(password)
      .subscribe(
        () => {
          this.passwordsDropdown.refresh();
          this.showMessage('success', 'PasswordSaved_SuccessMessage');
        }
      );
  }

  public setPassword(password: string): void {
    this.passwordInput.setValue({ password });
  }

  public protectedStatusChanges(event: { status: string, fileName: string }): void {
    if (event.status === 'protected') {
      this.router.navigate(['/unlock'], { queryParams: { fileName: event.fileName } });
    }
  }

  private valid(): boolean {
    this.fileInput.ensureValue();
    this.passwordInput.ensureValue();

    return this.fileInput.valid && this.passwordInput.valid;
  }

  private setFileName(fileName: string): void {
    this.fileInput.setValue(fileName);
  }

  private reset(): void {
    this.fileInput.reset();
    this.passwordInput.reset();
  }

  private handleProtectError(err: { errorType: string, errorDescription?: string }): void {
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
        this.lockPdfService.showSuccessMessage(uiMessage);
        break;
      case 'error':
        this.lockPdfService.showErrorMessage(uiMessage);
        break;
      case 'warning':
        this.lockPdfService.showWarningMessage(uiMessage);
        break;
    }
  }

  private saveState(): void {
    const value = {
      fileName: this.fileInput.value,
      ...this.passwordInput.value
    };

    this.lockPdfService.saveState(value);
  }

  private loadState(): void {
    const state = this.lockPdfService.popState();

    if (!state) {
      return;
    }

    this.setFileName(state.fileName);
    this.passwordInput.setValue({...state});
  }
}
