import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PasswordOptionComponent } from './password-options/password-option/password-option.component';
import { PasswordOptionsComponent } from './password-options/password-options.component';
import { PasswordGenComponent } from './password-gen.component';

@NgModule({
  declarations: [
    PasswordOptionComponent,
    PasswordOptionsComponent,
    PasswordGenComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    PasswordGenComponent
  ]
})
export class PasswordGenModule { }
