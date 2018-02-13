import { NgModule } from '@angular/core';
import { PdfProtectService } from './pdf-protect.service';
import { ElectronService } from './electron.service';

@NgModule({
  providers: [
    PdfProtectService,
    ElectronService
  ]
})
export class ServicesModule { }
