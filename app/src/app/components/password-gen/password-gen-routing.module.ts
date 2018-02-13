import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordGenComponent } from './password-gen.component';

const routes: Routes = [
  {
    path: '',
    component: PasswordGenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordGenRoutingModule { }
