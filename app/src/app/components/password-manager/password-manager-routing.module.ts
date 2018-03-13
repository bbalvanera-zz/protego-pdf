import { NgModule } from '@angular/core';
import { PasswordManagerComponent } from './password-manager.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PasswordManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordManagerRoutingModule { }
