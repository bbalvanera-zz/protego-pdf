import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { PdfProtectionOptions } from 'protego-pdf-helper';

import { ElectronService } from '../../services/electron.service';
import { PdfProtectService } from '../../services/pdf-protect.service';
import { CustomValidators } from '../../core/validators/CustomValidators';
import { PdfProtectMode } from '../../core/PdfProtectMode';
import { PdfProtector } from '../../core/PdfProtector';
import { PasswordStrengthMeterDirective } from './password-strength-meter/password-strength-meter.directive';

const fieldCompareValidator = CustomValidators.fieldCompare('password', 'passwordConfirm');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(PasswordStrengthMeterDirective)
  private passwordStrengthMeter: PasswordStrengthMeterDirective;
  private unsubscriber: Subject<void>;
  private form: FormGroup;
  private selectedFile: PdfProtector;

  public readonly readyForDataTransfer = false; // used only by the view
  public readonly showPassword         = false; // used only by the view;

  constructor(
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    formBuilder: FormBuilder) {
      this.unsubscriber = new Subject<void>();
      this.createForm(pdfService, formBuilder);
  }

  private get fileName(): FormControl { return this.form.get('fileName') as FormControl; }
  private get password(): FormControl { return this.form.get('password') as FormControl; }
  private get passwordConfirm(): FormControl { return this.form.get('passwordConfirm') as FormControl; }
  private get passwordStrength(): number { return this.passwordStrengthMeter.passwordStrength; }

  public ngOnInit(): void {
    this.fileName.statusChanges
      .pipe(
        takeUntil(this.unsubscriber),
        filter(status => status !== 'PENDING')
      )
      .subscribe(status => {
        this.changeDetector.detectChanges();
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
  }

  public ngAfterViewInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(params => {
        if (params.pwd) {
          this.form.patchValue({ password: params.pwd, passwordConfirm: params.pwd });
          // setting the value of `password` through `patchValue`
          // doesn't trigger the `change` or `input` event on the field
          // so ask the directive to update itself after setting a new password
          this.passwordStrengthMeter.updatePasswordStrength();
        }
      });
  }

  public browse(): void {
    this.electronService.selectFile()
      .pipe(
        filter(files => files && files.length > 0),
        map(files => files[0])
      )
      .subscribe(file => this.setFileName(file));
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

    this.selectedFile.protect(this.password.value, mode)
      .subscribe(
        _ => {
          this.form.reset('', { onlySelf: true, emitEvent: false });
          this.passwordStrengthMeter.updatePasswordStrength();
          this.electronService.showInfoBox('ProtegoPdf', 'Your file has been protected.');
        },
        err => {
          let msg = '';

          if (err.errorType === 'File_Access_Error') {
            msg = 'Could not protect your file. The file is open in another program.';
            this.fileName.setErrors({ fileAccessError: true });
          } else if (err.errorType === 'Insufficient_Permissions') {
            msg = 'Could not protect your file. Access is denied.';
          } else {
            msg = `Could not protect your file. General error. ${err.errorDescription}`;
          }

          this.electronService.showErrorBox('ProtegoPdf', msg);
        }
      );
  }

  public togglePasswordVisibility(state: boolean): void {
    (this as { showPassword: boolean }).showPassword = state;

    const opts = {
      onlySelf: true,
      emitEvent: false
    };

    if (this.showPassword) {
      this.form.clearValidators();
      this.passwordConfirm.setValue('', opts);
      this.passwordConfirm.disable();
    } else {
      this.passwordConfirm.enable();
      this.passwordConfirm.setValue(this.password.value, opts);
      this.form.setValidators(fieldCompareValidator);
    }
  }

  private setFileName(fileName: string): void {
    this.selectedFile = new PdfProtector(fileName);
    const displayName = this.selectedFile.name;

    this.form.patchValue({ displayName, fileName }, { emitEvent: true });
    this.fileName.markAsDirty(); // trigger validation
  }

  private valid(): boolean {
    const controls = this.form.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.form.get(controlName);
        control.markAsDirty();
      }
    }

    return this.form.valid;
  }

  private createForm(pdfService: PdfProtectService, formBuilder: FormBuilder): void {
    const pdfDocumentValidator = CustomValidators.pdfDocument(pdfService);

    this.form = formBuilder.group(
      {
        fileName: ['', Validators.required, pdfDocumentValidator],
        displayName: '',
        password: ['', Validators.required],
        passwordConfirm: ['']
      },
      {
        validator: fieldCompareValidator
      }
    );
  }
}
