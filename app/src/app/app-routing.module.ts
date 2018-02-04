import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PasswordGenComponent } from './components/password-gen/password-gen.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'password-gen',
    component: PasswordGenComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
