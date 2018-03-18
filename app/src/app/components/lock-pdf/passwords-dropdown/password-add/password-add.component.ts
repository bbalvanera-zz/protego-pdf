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

import { Component, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators, AsyncValidatorFn } from '@angular/forms';
import { SavedPasswordsService } from '../../../../shared/services/saved-passwords.service';
import { SavedPassword } from '../../../../../modules/protego-pdf-database/entities/saved-password';
import { UNIQUE_PASSWORD_NAME_VALIDATOR, uniquePasswordNameValidatorProvider } from '../../../../shared/unique-password-name.validator';
import { Logger } from '../../../../shared/logging/logger';

@Component({
  selector: 'app-password-add',
  templateUrl: './password-add.component.html',
  styleUrls: ['./password-add.component.scss'],
  providers: [uniquePasswordNameValidatorProvider]
})
export class PasswordAddComponent {
  public passwordName: FormControl;
  public favorite: FormControl;
  public password: string; // when opened as modal, this value is set by the caller

  constructor(
    @Inject(UNIQUE_PASSWORD_NAME_VALIDATOR)
    private uniquePasswordNameValidator: AsyncValidatorFn,
    private modal: NgbActiveModal,
    private savedPasswordsService: SavedPasswordsService) {

    this.passwordName = new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ]),
      uniquePasswordNameValidator
    );
    this.favorite = new FormControl(false);
  }

  public dismissModal(): void {
    if (this.modal) {
      this.modal.dismiss(); // manual close
    }
  }

  public save(): void {
    if (this.passwordName.invalid) {
      this.passwordName.markAsDirty();
      return;
    }

    const savedPassword: SavedPassword = {
      name: this.passwordName.value,
      favorite: Number(this.favorite.value),
      password: this.password
    };

    this.savedPasswordsService.save(savedPassword)
      .subscribe(
        () => this.closeModal(),
        err => Logger.error(`[PasswordAdd.save] Error in SavedPasswordsService.save: ${err.errorDescription}`)
      );
  }

  private closeModal(): void {
    if (this.modal) {
      this.modal.close();
    }
  }
}
