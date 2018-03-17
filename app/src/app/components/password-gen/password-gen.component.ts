/**
 * Copyright (C) 2018 Bernardo Balvanera
 *
 * This file is part of ProtegoPdf.
 *
 * ProtegoPdf is a free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { PasswordOptions } from './classes/password-options';
import { PasswordGenerator } from './classes/password-generator';

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
      .subscribe(_ => {
        this.generatePassword();
      });

    this.generatePassword();
  }

  public generatePassword(): void {
    const options = this.passwordOptions.value;
    const pwd     = PasswordGenerator.generate(options);
    this.password.setValue(pwd);
  }
}
