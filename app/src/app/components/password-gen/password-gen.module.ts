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
