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

import { SHARED_DIRECTIVES } from './directives/index';
import { SHARED_PIPES } from './pipes/index';
import { FileInputComponent } from './components/file-input';
import { SuccessToastrComponent } from './components/success-toastr/success-toastr.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    SHARED_DIRECTIVES,
    SHARED_PIPES,
    FileInputComponent,
    SuccessToastrComponent,
    CardComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    SHARED_DIRECTIVES,
    SHARED_PIPES,
    FileInputComponent,
    CardComponent
  ],
  entryComponents: [
    SuccessToastrComponent,
    AboutComponent
  ]
})
export class SharedModule { }
