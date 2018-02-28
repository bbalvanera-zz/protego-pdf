import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeRoutingModule } from './home-routing.module';
import { FocusWithinDirective } from './focus-within/focus-within.directive';
import { PasswordStrengthMeterDirective } from './password-strength-meter/password-strength-meter.directive';
import { UIMessagesDirective } from '../../shared/ui-messages/ui-messages.directive';
import { UIMessageDirective } from '../../shared/ui-messages/ui-message/ui-message.directive';

import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    FocusWithinDirective,
    PasswordStrengthMeterDirective,
    UIMessagesDirective,
    UIMessageDirective,
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    HomeRoutingModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
