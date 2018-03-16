import { Component, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators, AsyncValidatorFn } from '@angular/forms';
import { SavedPasswordsService } from '../../../../services/saved-passwords.service';
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
