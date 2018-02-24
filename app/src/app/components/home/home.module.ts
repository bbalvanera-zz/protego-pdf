import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';
import { FocusWithinDirective } from './focus-within/focus-within.directive';
import { PasswordStrengthMeterDirective } from './password-strength-meter/password-strength-meter.directive';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    FocusWithinDirective,
    PasswordStrengthMeterDirective,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
