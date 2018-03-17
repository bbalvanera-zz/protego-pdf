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
import { Routes, RouterModule } from '@angular/router';

import { LockPdfComponent } from './components/lock-pdf/lock-pdf.component';
import { PasswordGenComponent } from './components/password-gen/password-gen.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';

const routes: Routes = [
  {
    path: '',
    component: LockPdfComponent
  },
  {
    path: 'password-gen',
    component: PasswordGenComponent
  },
  {
    path: 'password-man',
    component: PasswordManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
