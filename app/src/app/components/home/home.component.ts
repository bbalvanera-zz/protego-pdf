import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';

import { ElectronService } from '../../services/electron.service';
import { PdfProtectService } from '../../services/pdf-protect.service';
import { CustomValidators } from '../../core/validators/CustomValidators';
import { PasswordFieldComponent } from './password-field/password-field.component';

const path = window.require('path');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscriber = new Subject();
  private form: FormGroup;

  @ViewChild(PasswordFieldComponent)
  public passwordFieldComponent: PasswordFieldComponent;
  public readyForDataTransfer = false; // used by view

  constructor(
    formBuilder: FormBuilder,
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef) {
      this.createForm(pdfService, formBuilder);
  }

  public get selectedFile(): FormControl { return this.form.get('selectedFile') as FormControl; }
  public get password(): FormControl { return this.form.get('password') as FormControl; }

  public ngOnInit(): void {
    this.selectedFile.statusChanges
      .pipe(
        takeUntil(this.unsubscriber),
        filter(status => status !== 'PENDING')
      )
      .subscribe(status => {
        this.changeDetector.detectChanges();
      });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(params => {
        if (params.pwd) {
          this.password.setValue(params.pwd);
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
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

  public protectDocument(): void {
    if (!this.valid()) {
      console.log('not protected');
      return;
    }

    console.log('document protected!');
  }

  private setFileName(selectedFile: string): void {
    const fileName = path.basename(selectedFile);
    this.form.patchValue({ fileName, selectedFile }, { emitEvent: true });
    this.selectedFile.markAsDirty();
  }

  private valid(): boolean {
    this.selectedFile.markAsDirty();
    this.passwordFieldComponent.markAsDirty();

    return this.form.valid;
  }

  private createForm(pdfService: PdfProtectService, formBuilder: FormBuilder): void {
    const pdfDocumentValidator = CustomValidators.pdfDocument(pdfService);

    this.form = formBuilder.group({
      selectedFile: ['', Validators.required, pdfDocumentValidator],
      fileName: '',
      password: ['', Validators.required],
    });
  }
}
