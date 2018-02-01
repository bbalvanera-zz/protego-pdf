import { Component } from '@angular/core';

import { PasswordOptions } from './password-options/password-options.component';

@Component({
  selector: 'app-password-gen',
  templateUrl: './password-gen.component.html',
  styleUrls: ['./password-gen.component.scss']
})
export class PasswordGenComponent {
  public passwordOptions = new PasswordOptions();

  public regeneratePassword(options: PasswordOptions) {
    console.log(`will regenerate password with: `);
    console.log(options);
  }
}
