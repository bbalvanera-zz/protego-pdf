import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { debounceTime } from 'rxjs/operators/debounceTime';

import { ElectronService } from '../../services/electron.service';
import { PdfProtectService } from '../../services/pdf-protect.service';
import { CustomValidators } from '../../core/validators/CustomValidators';

const path = window.require('path');
const zxcvbn = window.require('zxcvbn');
const DEFAULT_PWD_SCORE = -1;

function passwordMatchValidator(form: FormGroup) {
  return !(this.password === this.passwordConfirm)
    ? { notIdentical: true }
    : null;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscriber = new Subject();

  public protectPdf: FormGroup;
  public selectedFile: AbstractControl;
  public password: AbstractControl;
  public passwordConfirm: AbstractControl;

  public passwordScore = DEFAULT_PWD_SCORE;
  public readyForDataTransfer = false;
  public viewPassword = false;

  constructor(
    formBuilder: FormBuilder,
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef) {

    this.createForm(pdfService, formBuilder);
    this.selectedFile    = this.protectPdf.get('selectedFile');
    this.password        = this.protectPdf.get('password');
    this.passwordConfirm = this.protectPdf.get('passwordConfirm');
  }

  public ngOnInit() {
    this.selectedFile.statusChanges
      .pipe(
        takeUntil(this.unsubscriber),
        filter((status) => status !== 'PENDING')
      )
      .subscribe((status) => {
        this.changeDetector.detectChanges();
      });

    this.password.valueChanges
      .pipe(
        takeUntil(this.unsubscriber),
        debounceTime(250)
      )
      .subscribe((_) => this.updatePasswordScore());

    this.route.queryParams
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(params => {
        if (params.pwd) {
          this.protectPdf.patchValue({ password: params.pwd, passwordConfirm: params.pwd });
        }
      });
  }

  public ngOnDestroy() {
    this.unsubscriber.next();
  }

  public browse(): void {
    this.electronService.selectFile()
      .pipe(
        filter((files) => files && files.length > 0),
        map((files) => files[0])
      )
      .subscribe((file) => this.setFileName(file));
  }

  public prepareForDataTransfer(transferItem: DataTransferItem): void {
    if (transferItem.kind === 'file' && transferItem.type === 'application/pdf') {
      this.readyForDataTransfer = true;
    }
  }

  public acceptDataTransfer(transferItem: DataTransfer): void {
    if (transferItem.files.length === 0) {
      return; // nothing to work with
    }

    this.setFileName(transferItem.files[0].path);
    this.readyForDataTransfer = false;
  }

  public cancelDataTransfer(): void {
    this.readyForDataTransfer = false;
  }

  public togglePasswordView(): void {
    if (this.password.value) {
      this.viewPassword = !this.viewPassword
    }
  }

  public protectDocument(): void {
    if (!this.valid()) {
      return;
    }

    console.log('document protected!');
  }

  private setFileName(selectedFile: string) {
    const fileName = path.basename(selectedFile);
    this.protectPdf.patchValue({ fileName, selectedFile }, { emitEvent: true });
    this.selectedFile.markAsDirty();
  }

  private updatePasswordScore() {
    if (this.password.value === null ||
        this.password.value === undefined ||
        this.password.value.length === 0) {

      this.passwordScore = DEFAULT_PWD_SCORE;
      return;
    }

    const result = zxcvbn(this.password.value);
    this.passwordScore = result.score;
  }

  private valid(): boolean {
    for(const controlName in this.protectPdf.controls) {
      const control = this.protectPdf.get(controlName);
      control.markAsDirty();
    }

    return this.protectPdf.valid;
  }

  private createForm(pdfService: PdfProtectService, formBuilder: FormBuilder) {
    const pdfDocumentValidator = CustomValidators.pdfDocument(pdfService);
    const fieldCompareValidator = CustomValidators.fieldCompare('password', 'passwordConfirm');

    this.protectPdf = formBuilder.group(
    {
      selectedFile: ['', Validators.required, pdfDocumentValidator],
      fileName: '',
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    },
    {
      validator: fieldCompareValidator
    });
  }
}
