import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { ServicesModule } from './services/services.module';
import { LockPdfModule } from './components/lock-pdf/lock-pdf.module';
import { PasswordGenModule } from './components/password-gen/password-gen.module';
import { PasswordManagerModule } from './components/password-manager/password-manager.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    ServicesModule,
    LockPdfModule,
    PasswordGenModule,
    PasswordManagerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
