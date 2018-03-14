import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LockPdfRoutingModule } from './lock-pdf-routing.module';
import { PasswordStrengthMeterDirective } from './password-input/password-strength-meter/password-strength-meter.directive';
import { LockPdfComponent } from './lock-pdf.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { PasswordsDropdownComponent } from './passwords-dropdown/passwords-dropdown.component';
import { SharedModule } from '../../shared/shared.module';
import { PasswordAddComponent } from './passwords-dropdown/password-add/password-add.component';

@NgModule({
  declarations: [
    PasswordStrengthMeterDirective,
    LockPdfComponent,
    PasswordInputComponent,
    PasswordsDropdownComponent,
    PasswordAddComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    LockPdfRoutingModule
  ],
  entryComponents: [
    PasswordAddComponent
  ],
  exports: [
    LockPdfComponent
  ]
})
export class LockPdfModule { }
