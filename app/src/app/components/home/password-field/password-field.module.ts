import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FocusWithinDirective } from './focus-within/focus-within.directive';
import { PasswordStrengthMeterDirective } from './password-strength-meter/password-strength-meter.directive';
import { PasswordFieldComponent } from './password-field.component';

@NgModule({
  declarations: [
    FocusWithinDirective,
    PasswordStrengthMeterDirective,
    PasswordFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    PasswordFieldComponent
  ]
})
export class PasswordFieldModule { }
