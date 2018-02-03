import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { PasswordOptions } from './password-options/PasswordOptions';

@Component({
  selector: 'app-password-gen',
  templateUrl: './password-gen.component.html',
  styleUrls: ['./password-gen.component.scss']
})
export class PasswordGenComponent implements OnInit {
  private unsubscribe = new Subject<void>();

  public passwordOptions = new FormControl();

  public ngOnInit() {
    this.passwordOptions.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((passwordOptions) => {
        this.generatePassword(passwordOptions);
      });
  }

  public generatePassword(options: PasswordOptions) {
    console.log(`will regenerate password with: `);
    console.log(options);
  }
}
