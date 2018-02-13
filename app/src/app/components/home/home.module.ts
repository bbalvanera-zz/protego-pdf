import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PasswordFieldModule } from './password-field/password-field.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordFieldModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
