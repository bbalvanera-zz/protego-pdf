import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { PasswordOptions } from '../../core/PasswordOptions';
import { PasswordGenerator } from '../../core/PasswordGenerator';

const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  lowerCase: true,
  upperCase: true,
  numbers: true,
  specialChars: true,
  passwordLength: 20
};

@Component({
  selector: 'app-password-gen',
  templateUrl: './password-gen.component.html',
  styleUrls: ['./password-gen.component.scss']
})
export class PasswordGenComponent implements OnInit {
  private unsubscribe = new Subject<void>();

  public passwordOptions = new FormControl(DEFAULT_PASSWORD_OPTIONS);
  public password = new FormControl();

  public ngOnInit(): void {
    this.passwordOptions.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(passwordOptions => {
        this.generatePassword();
      });

    this.generatePassword();
  }

  public generatePassword(): void {
    const options = this.passwordOptions.value;
    const pwd = PasswordGenerator.generate(options);
    this.password.setValue(pwd);
  }
}
