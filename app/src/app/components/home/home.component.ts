import { Component, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { PdfProtectService } from '../../services/pdf-protect.service';

const path = window.require('path');
const zxcvbn = window.require('zxcvbn');
const DEFAULT_PWD_SCORE = -1;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public fileNameDisplay = '';
  public password = '';
  public passwordConfirm = '';
  public passwordScore = DEFAULT_PWD_SCORE;
  public draggingOver = false;
  public invalidFile = false;

  private  selectedFile = '';

  constructor(
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private changeDetector: ChangeDetectorRef) {
  }

  public browse() {
    this.electronService.selectFile()
      .subscribe((files) => {
        if (files && files.length > 0) {
          this.setFileName(files[0]);
        }
      }
    );
  }

  public showDropLocation(transferItem: DataTransferItem): void {
    if (transferItem.kind === 'file' && transferItem.type === 'application/pdf') {
      this.draggingOver = true;
    }
  }

  public hideDropLocation(): void {
    this.draggingOver = false;
  }

  public handleFileDrop(transferItem: DataTransfer): void {
    if (transferItem.files.length === 0) {
      return; // nothing to work with
    }

    this.setFileName(transferItem.files[0].path);
    this.draggingOver = false;
  }

  public updatePasswordScore(): void {
    if (!this.password || this.password.length === 0) {
        this.passwordScore = DEFAULT_PWD_SCORE;
        return;
    }

    const result = zxcvbn(this.password);
    this.passwordScore = result.score;
}

  private setFileName(filePath: string): void {
    const fileName = path.basename(filePath);

    this.selectedFile = filePath;
    this.fileNameDisplay = fileName;

    this.pdfService.pdfDocument(filePath)
      .subscribe(
        (isPdf) => {
          this.invalidFile = !isPdf;
          this.changeDetector.detectChanges();
        },
        (error) => console.log(error)
      );
  }
}
