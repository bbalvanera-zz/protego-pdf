import { NgModule } from '@angular/core';
import { PdfProtectService } from './pdf-protect.service';
import { ElectronService } from './electron.service';
import { SavedPasswordsService } from './saved-passwords.service';

@NgModule({
  providers: [
    PdfProtectService,
    ElectronService,
    SavedPasswordsService
  ]
})
export class ServicesModule { }
