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
import { LockSuccessToastrComponent } from './lock-success-toastr/lock-success-toastr.component';
import { FileInputComponent } from '../../shared/components/file-input/file-input.component';

@NgModule({
  declarations: [
    PasswordStrengthMeterDirective,
    PasswordInputComponent,
    PasswordsDropdownComponent,
    PasswordAddComponent,
    LockSuccessToastrComponent,
    FileInputComponent,
    LockPdfComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    LockPdfRoutingModule
  ],
  entryComponents: [
    PasswordAddComponent,
    LockSuccessToastrComponent
  ],
  exports: [
    LockPdfComponent
  ]
})
export class LockPdfModule { }
