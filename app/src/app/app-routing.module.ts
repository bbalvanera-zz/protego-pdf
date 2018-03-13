import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LockPdfComponent } from './components/lock-pdf/lock-pdf.component';
import { PasswordGenComponent } from './components/password-gen/password-gen.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';

const routes: Routes = [
  {
    path: '',
    component: LockPdfComponent
  },
  {
    path: 'password-gen',
    component: PasswordGenComponent
  },
  {
    path: 'password-man',
    component: PasswordManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
