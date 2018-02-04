import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { PdfProtectService } from '../../services/pdf-protect.service';
import { Subscription } from 'rxjs/Subscription';

const path = window.require('path');
const zxcvbn = window.require('zxcvbn');
const DEFAULT_PWD_SCORE = -1;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private selectedFile = '';

  public fileNameDisplay = '';
  public password = '';
  public passwordConfirm = '';
  public passwordScore = DEFAULT_PWD_SCORE;
  public draggingOver = false;
  public invalidFile = false;
  public readyToProtect = false;

  constructor(
    private electronService: ElectronService,
    private pdfService: PdfProtectService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.subscription = this.route.queryParams.subscribe((params) => {
      if (params.pwd) {
        this.passwordConfirm = this.password = params.pwd;
        this.updatePasswordScore();
      }
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public browse() {
    this.electronService.selectFile()
      .subscribe((files) => {
        if (files && files.length > 0) {
          this.setFileName(files[0]);
        }
      },
      (error) => {
        console.log(error);
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

  public passwordsMatch(): boolean {
    return !(this.password === this.passwordConfirm);
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
