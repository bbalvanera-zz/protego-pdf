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

import {
  Component,
  OnInit,
  OnDestroy,
  Provider,
  forwardRef,
  Renderer2,
  NgZone,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormGroup,
  FormControl,
  Validators,
  AsyncValidatorFn
} from '@angular/forms';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators';

import { Logger } from '../../logging/logger';
import { PDF_DOCUMENT_VALIDATOR, pdfDocumentValidatorProvider } from './pdf-document.validator';
import { ElectronService } from '../../../services/electron.service';
import { IFileInput } from './ifile-input';
import { PdfProtectService } from '../../../services/pdf-protect.service';

const path = window.require('path');
const FILEINPUT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileInputComponent),
  multi: true
};

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  providers: [FILEINPUT_VALUE_ACCESSOR, pdfDocumentValidatorProvider]
})
export class FileInputComponent implements IFileInput, OnInit, OnDestroy {
  private removeListener: () => void;

  @Output()
  public protectedStatusChanges: EventEmitter<{ status: 'protected' | 'unprotected', fileName: string }>;
  public readyForDataTransfer: boolean;
  public displayName: string;
  public fileName: FormControl;

  constructor(
    @Inject(PDF_DOCUMENT_VALIDATOR)
    private pdfDocumentValidator: AsyncValidatorFn,
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private zone: NgZone,
    private renderer: Renderer2) {
      this.displayName = '';
      this.fileName = new FormControl('', Validators.required, pdfDocumentValidator);
      this.protectedStatusChanges = new EventEmitter<{ status: 'protected' | 'unprotected', fileName: string }>();
  }

  public get value(): string { return this.fileName.value; }
  public get valid(): boolean { return this.fileName.valid; }

  public ngOnInit(): void {
    this.removeListener = this.renderer.listen(
      'document',
      'dragenter',
      ($event: DragEvent) => this.prepareForDataTransfer($event.dataTransfer.items[0])
    );

    this.fileName.statusChanges
      .pipe(
        filter(status => status === 'VALID'),
        mergeMap(_ => {
          const value = this.fileName.value;

          // check to see if this new file is protected
          return this.pdfService.isProtected(value);
      }))
      .subscribe(isProtected => {
        const status = isProtected ? 'protected' : 'unprotected';
        const fileName = this.fileName.value;

        this.protectedStatusChanges.emit({ status, fileName });
      });
  }

  public ngOnDestroy(): void {
    this.removeListener();
  }

  public browse(): void {
    this.electronService.selectFile()
      .pipe(
        filter(files => files && files.length > 0),
        map(files => files[0])
      )
      .subscribe(
        file => {
          // use ngZone since this call comes from a different thread (MainProcess thread).
          this.zone.run(() => this.setValue(file));
        },
        err => {
          Logger.error(`[FileInput.browse] Error in lockPdfService.selectFile: ${err.errorDescription}`);
        }
      );
  }

  public setValue(fileName: string): void {
    this.displayName = path.parse(fileName).base;
    this.fileName.setValue(fileName);

    if (fileName) {
      this.fileName.markAsDirty();
    }
  }

  public ensureValue(): void {
    this.fileName.markAsDirty();
  }

  public setAccessError(): void {
    this.fileName.setErrors({ fileAccessError: true });
  }

  public reset(): void {
    this.displayName = '';
    this.fileName.setValue('');
    this.fileName.markAsPristine();
  }

  public prepareForDataTransfer(transferItem: DataTransferItem): void {
    if (transferItem.kind === 'file' && transferItem.type === 'application/pdf') {
      this.readyForDataTransfer = true;
    }
  }

  public acceptDataTransfer(transferItem: DataTransfer): void {
    if (transferItem.files.length === 0) {
      return;
    }

    this.setValue(transferItem.files[0].path);
    this.readyForDataTransfer = false;
  }

  public cancelDataTransfer(): void {
    this.readyForDataTransfer = false;
  }
}
