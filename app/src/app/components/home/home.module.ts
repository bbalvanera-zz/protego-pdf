import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeRoutingModule } from './home-routing.module';
import { FocusWithinDirective } from './password-input/focus-within/focus-within.directive';
import { PasswordStrengthMeterDirective } from './password-input/password-strength-meter/password-strength-meter.directive';
import { HomeComponent } from './home.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    FocusWithinDirective,
    PasswordStrengthMeterDirective,
    HomeComponent,
    PasswordInputComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    HomeRoutingModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
