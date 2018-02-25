import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './components/home/home.module';
import { PasswordGenModule } from './components/password-gen/password-gen.module';
import { ServicesModule } from './services/services.module';

import { AppComponent } from './app.component';
import { ServiceLocator } from './core/ServiceLocator';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    NgbModule.forRoot(),
    HomeModule,
    PasswordGenModule,
    ServicesModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    ServiceLocator.injector = injector;
  }
}
