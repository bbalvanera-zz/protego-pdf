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
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PasswordOptionComponent } from './password-options/password-option/password-option.component';
import { PasswordOptionsComponent } from './password-options/password-options.component';
import { PasswordGenComponent } from './password-gen.component';
import { PasswordGenRoutingModule } from './password-gen-routing.module';

@NgModule({
  declarations: [
    PasswordOptionComponent,
    PasswordOptionsComponent,
    PasswordGenComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    PasswordGenRoutingModule
  ],
  exports: [
    PasswordGenComponent
  ]
})
export class PasswordGenModule { }
