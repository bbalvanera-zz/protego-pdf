import { Component, OnInit, OnDestroy, ViewChild, NgZone, Inject } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';

import { PdfProtectMode } from './classes/pdf-protect-mode.enum';
import { HomeForm } from './classes/home.form';
import { HomeService } from './home.service';
import { UIMessagesDirective } from '../../shared/directives/ui-messages.directive';
import { PasswordInputComponent } from './password-input/password-input.component';
import { PDF_DOCUMENT_VALIDATOR, pdfDocumentValidatorProvider } from './classes/pdf-document.validator';

const path = window.require('path');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService, pdfDocumentValidatorProvider]
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild(UIMessagesDirective)
  private uiMessages: UIMessagesDirective;
  @ViewChild(PasswordInputComponent)
  private passwordInput: PasswordInputComponent;

  private unsubscriber: Subject<void>;

  public readonly readyForDataTransfer: boolean; // used only by the view
  public readonly form: HomeForm;

  constructor(
    @Inject(PDF_DOCUMENT_VALIDATOR)
    private pdfDocumentValidator: AsyncValidatorFn,
    private homeService: HomeService,
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
        filter(event => event instanceof NavigationStart),
        filter((event: NavigationStart) => event.url === '/password-gen')
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
    this.homeService.selectFile()
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

    this.homeService.protectFile(this.form.fileNameValue, this.form.passwordValue, mode)
      .subscribe(
        _ => {
          // use ngZone since this could potentially be called by a different thread (MainProcess thread)
          // usually when `Save As` is selected.
          this.zone.run(() => {
            this.reset();

            const uiMessage = this.uiMessages.get('Success_Message');
            this.homeService.showSuccessMessage(uiMessage);
          });
        },
        err => {
          this.handleProtectError(err);
        }
      );
  }

  private setFileName(fileName: string): void {
    const displayName = path.parse(fileName).base;

    this.form.patchValue({ displayName, fileName }, { emitEvent: true });
    this.form.markFileNameAsDirty();
  }

  private setPassword(password: string): void {
    this.form.patchValue({ password: { password } });
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

    let uiMessage: { title?: string, message?: string };
    switch (err.errorType) {
      case 'File_Access_Error':
        this.form.setFileNameErrors({ fileAccessError: true });
        // break; Yes, fall-through is intentional
      case 'Insufficient_Permissions':
        uiMessage = this.uiMessages.get(err.errorType);
        break;
      default:
        uiMessage = this.uiMessages.get('General_Error');
        break;
    }

    this.homeService.showErrorMessage(uiMessage);
  }

  private saveState(): void {
    this.homeService.saveState(this.form.value);
  }

  private loadState(): void {
    const state = this.homeService.popState();

    if (!state) {
      return;
    }

    this.form.setValue(state);

    if (state.fileName) {
      this.form.markFileNameAsDirty();
    }
  }

  private initForm(): void {
    (this as { form: HomeForm }).form = new HomeForm(this.passwordInput, this.pdfDocumentValidator);
  }
}
