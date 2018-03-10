import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';

import { CustomValidators } from '../../core/validators/CustomValidators';
import { PdfProtectMode } from '../../core/PdfProtectMode';
import { PasswordStrengthMeterDirective } from './password-strength-meter/password-strength-meter.directive';
import { UIMessagesDirective } from '../../shared/ui-messages/ui-messages.directive';
import { HomeModel } from './home.model';
import { HomeFacade } from './home.facade';

const path = window.require('path');
const fieldCompareValidator = CustomValidators.fieldCompare('password', 'passwordConfirm');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [{ provide: HomeFacade, useClass: HomeFacade }]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(PasswordStrengthMeterDirective)
  private passwordStrengthMeter: PasswordStrengthMeterDirective;
  @ViewChild(UIMessagesDirective)
  private uiMessages: UIMessagesDirective;
  private unsubscriber: Subject<void>;

  public readonly readyForDataTransfer = false; // used only by the view
  public readonly model: HomeModel;

  constructor(
    private formBuilder: FormBuilder,
    private facade: HomeFacade,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone) {
      this.unsubscriber = new Subject<void>();
  }

  public ngOnInit(): void {
    this.initModel();
    this.loadState();

    this.router.events
      .pipe(
        takeUntil(this.unsubscriber),
        // Doing `event instanceOf NavigationStart && event.url === '/password-gen'` would have worked
        // but I like it this way
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

  public ngAfterViewInit(): void {
    // `setTimeout` is required since angular doesn't like view changes inside this method.
    // It works since it is actually another thread the one modifying the view not the current one.
    setTimeout(() => this.model.updatePasswordStrength());
  }

  public browse(): void {
    this.facade.selectFile()
      .subscribe(file => {
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

    this.facade.protectFile(this.model.fileNameValue, this.model.passwordValue, mode)
      .subscribe(
        _ => {
          this.zone.run(() => {
            this.reset();

            const uiMessage = this.uiMessages.get('Success_Message');
            this.facade.showSuccessMessage(uiMessage);
          });
        },
        err => {
          this.handleProtectError(err);
        }
      );
  }

  public togglePasswordVisibility(visible: boolean): void {
    visible
      ? this.model.disablePasswordConfirm()
      : this.model.enablePasswordConfirm(this.model.passwordValue, fieldCompareValidator);
  }

  private initModel(): void {
    const form = this.formBuilder.group(
      {
        fileName: ['', Validators.required, this.facade.getPdfDocumentValidator()],
        displayName: '',
        password: ['', Validators.required],
        passwordConfirm: [''],
        passwordVisible: [false],
      },
      {
        validator: fieldCompareValidator
      }
    );

    (this as { model: HomeModel }).model = new HomeModel(form, this.passwordStrengthMeter);
  }

  private setFileName(fileName: string): void {
    const displayName = path.parse(fileName).base;

    this.model.patchValue({ displayName, fileName }, { emitEvent: true });
    this.model.markFileNameAsDirty();
  }

  private setPassword(password: string): void {
    this.model.patchValue({
      password,
      passwordConfirm: this.model.passwordVisible ? '' : password
    });
  }

  private valid(): boolean {
    const controls = this.model.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.model.get(controlName);
        control.markAsDirty();
      }
    }

    return this.model.valid;
  }

  private reset(): void {
    this.model.reset('', { onlySelf: true, emitEvent: false });
    this.togglePasswordVisibility(false);
  }

  private handleProtectError(err: { errorType: string}): void {
    if (err.errorType === 'Canceled_By_User') {
      return;
    }

    let uiMessage: { title?: string, message?: string };
    switch (err.errorType) {
      case 'File_Access_Error':
        this.model.setFileNameErrors({ fileAccessError: true });
        // break; Yes, fall-through is intentional
      case 'Insufficient_Permissions':
        uiMessage = this.uiMessages.get(err.errorType);
        break;
      default:
        uiMessage = this.uiMessages.get('General_Error');
        break;
    }

    this.facade.showErrorMessage(uiMessage);
  }

  private saveState(): void {
    this.facade.saveState(this.model.value);
  }

  private loadState(): void {
    const state = this.facade.popState();

    if (!state) {
      return;
    }

    this.model.patchValue(state);
    this.togglePasswordVisibility(state.passwordVisible);

    if (state.fileName) {
      this.model.markFileNameAsDirty();
    }
  }
}
