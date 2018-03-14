import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { PasswordManagerComponent } from './password-manager.component';
import { PasswordManagerRoutingModule } from './password-manager-routing.module';

@NgModule({
  declarations: [PasswordManagerComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    PasswordManagerRoutingModule
  ],
  exports: [PasswordManagerComponent]
})
export class PasswordManagerModule {}
