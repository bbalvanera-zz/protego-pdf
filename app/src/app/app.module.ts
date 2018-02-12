import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ElectronService } from './services/electron.service';
import { PdfProtectService } from './services/pdf-protect.service';
import { PasswordGenComponent } from './components/password-gen/password-gen.component';
import { PasswordOptionComponent } from './components/password-gen/password-options/password-option/password-option.component';
import { PasswordOptionsComponent } from './components/password-gen/password-options/password-options.component';
import { PasswordFieldComponent } from './components/home/password-field/password-field.component';
import { FocusWithinDirective } from './components/home/password-field/focus-within/focus-within.directive';
import { PasswordStrengthMeterDirective } from './components/home/password-field/password-strength-meter/password-strength-meter.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PasswordGenComponent,
    PasswordOptionComponent,
    PasswordOptionsComponent,
    PasswordFieldComponent,
    FocusWithinDirective,
    PasswordStrengthMeterDirective
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    ElectronService,
    PdfProtectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
