import { Component, OnInit, OnDestroy, ViewChild, NgZone, Inject } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';

import { PdfProtectMode } from './classes/pdf-protect-mode.enum';
import { LockPdfForm } from './classes/lock-pdf.form';
import { LockPdfService } from './lock-pdf.service';
import { UIMessagesDirective } from '../../shared/directives/ui-messages.directive';
import { PasswordInputComponent } from './password-input/password-input.component';
import { PasswordsDropdownComponent } from './passwords-dropdown/passwords-dropdown.component';
import { PDF_DOCUMENT_VALIDATOR, pdfDocumentValidatorProvider } from './classes/pdf-document.validator';

const path = window.require('path');

@Component({
  selector: 'app-lock-pdf',
  templateUrl: './lock-pdf.component.html',
  styleUrls: ['./lock-pdf.component.scss'],
  providers: [LockPdfService, pdfDocumentValidatorProvider]
})
export class LockPdfComponent implements OnInit, OnDestroy {

  @ViewChild(UIMessagesDirective)
  private uiMessages: UIMessagesDirective;
  @ViewChild(PasswordInputComponent)
  private passwordInput: PasswordInputComponent;
  @ViewChild(PasswordsDropdownComponent)
  private passwordsDropdown: PasswordsDropdownComponent;

  private unsubscriber: Subject<void>;

  public readonly readyForDataTransfer: boolean; // used only by the view
  public readonly form: LockPdfForm;

  constructor(
    @Inject(PDF_DOCUMENT_VALIDATOR)
    private pdfDocumentValidator: AsyncValidatorFn,
    private lockPdfService: LockPdfService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone) {
      this.unsubscriber = new Subject<void>();
      this.readyForDataTransfer = false;
  }

  public ngOnInit(): void {
    this.initForm();
    this.loadState();

    this.router.events
      .pipe(
        takeUntil(this.unsubscriber),
        // Doing `event instanceOf NavigationStart && event.url === '/password-gen'` would have worked
        // but I like it this way.
        filter(event => event instanceof NavigationStart)
      )
      .subscribe(_ => {
        this.saveState();
      });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(params => {
        if (params.pwd) {
          this.setPassword(params.pwd);
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
  }

  public browse(): void {
    this.lockPdfService.selectFile()
      .subscribe(file => {
        // use ngZone since this call comes from a different thread (MainProcess thread).
        this.zone.run(() => this.setFileName(file));
      });
  }

  public prepareForDataTransfer(transferItem: DataTransferItem): void {
    if (transferItem.kind === 'file' && transferItem.type === 'application/pdf') {
      (this as { readyForDataTransfer: boolean }).readyForDataTransfer = true;
    }
  }

  public acceptDataTransfer(transferItem: DataTransfer): void {
    if (transferItem.files.length === 0) {
      return;
    }

    this.setFileName(transferItem.files[0].path);
    (this as { readyForDataTransfer: boolean }).readyForDataTransfer = false;
  }

  public cancelDataTransfer(): void {
    (this as { readyForDataTransfer: boolean }).readyForDataTransfer = false;
  }

  public protectDocument(mode: PdfProtectMode): void {
    if (!this.valid()) {
      return;
    }

    this.lockPdfService.protectFile(this.form.fileNameValue, this.form.passwordValue, mode)
      .subscribe(
        _ => {
          // use ngZone since this could potentially be called by a different thread (MainProcess thread)
          // usually when `Save As` is selected.
          this.zone.run(() => {
            this.reset();
            this.showMessage('success', 'Success_Message');
          });
        },
        err => {
          this.handleProtectError(err);
        }
      );
  }

  public savePassword(): void {
    if (!this.form.passwordValid) {
      this.form.ensurePasswordValue();
      this.showMessage('warning', 'Invalid_Password_To_Save');

      return;
    }

    this.lockPdfService.savePassword(this.form.passwordValue)
      .subscribe(
        () => {
          this.passwordsDropdown.refresh();
          this.showMessage('success', 'PasswordSaved_SuccessMessage');
        },
        reason => console.log(reason) // add proper logging
      );
  }

  public setPassword(password: string): void {
    this.form.patchValue({ password: { password } });
  }

  private setFileName(fileName: string): void {
    const displayName = path.parse(fileName).base;

    this.form.patchValue({ displayName, fileName }, { emitEvent: true });
    this.form.markFileNameAsDirty();
  }

  private valid(): boolean {
    // if validation errors exist, show them
    this.form.showValidation();
    return this.form.valid;
  }

  private reset(): void {
    this.form.reset();
  }

  private handleProtectError(err: { errorType: string}): void {
    if (err.errorType === 'Canceled_By_User') {
      return; // when user cancels `Save As` dialog
    }

    switch (err.errorType) {
      case 'File_Access_Error':
        this.form.setFileNameErrors({ fileAccessError: true });
        // break; Yes, fall-through is intentional
      case 'Insufficient_Permissions':
        this.showMessage('error', err.errorType);
        break;
      default:
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
    this.lockPdfService.saveState(this.form.value);
  }

  private loadState(): void {
    const state = this.lockPdfService.popState();

    if (!state) {
      return;
    }

    this.form.setValue(state);

    if (state.fileName) {
      this.form.markFileNameAsDirty();
    }
  }

  private initForm(): void {
    (this as { form: LockPdfForm }).form = new LockPdfForm(this.passwordInput, this.pdfDocumentValidator);
  }
}
