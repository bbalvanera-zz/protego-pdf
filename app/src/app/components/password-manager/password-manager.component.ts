import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SavedPassword } from '../../../modules/protego-pdf-database/entities/saved-password';
import { SavedPasswordsService } from '../../services/saved-passwords.service';
import { UIMessagesDirective } from '../../shared/directives';
import { PasswordManagerForm } from './password-manager.form';
import { UNIQUE_PASSWORD_NAME_VALIDATOR, uniquePasswordNameValidatorProvider } from '../../shared/unique-password-name.validator';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss'],
  providers: [uniquePasswordNameValidatorProvider]
})
export class PasswordManagerComponent implements OnInit {
  @ViewChild(UIMessagesDirective)
  private uiMessages: UIMessagesDirective;
  private passwordCache: SavedPassword[];

  public savedPasswords: Observable<SavedPassword[]>;
  public form: PasswordManagerForm;

  constructor(
    @Inject(UNIQUE_PASSWORD_NAME_VALIDATOR)
    uniquePasswordNameValidator: AsyncValidatorFn,
    private savedPasswordsService: SavedPasswordsService,
    private toastrService: ToastrService) {

    this.form = new PasswordManagerForm(uniquePasswordNameValidator);
  }

  public ngOnInit(): void {
    this.refresh();
  }

  public save(): void {
    if (!this.form.valid) {
      this.form.showValidation();
      return;
    }

    const pwd: SavedPassword = {
      name: this.form.nameValue,
      password: this.form.passwordValue,
      favorite: Number(this.form.favoriteValue)
    };

    this.savedPasswordsService.save(pwd)
      .subscribe(_ => {
        this.form.reset();
        this.refresh();
        this.showMessage('success', 'Success_Message');
      });
  }

  public getItemId(index: number, pwd: SavedPassword): string {
    return pwd ? pwd.name : undefined;
  }

  public updateFavorite(id: string): void {
    const update = this.passwordCache.find(pwd => pwd.name === id);

    if (update) {
      update.favorite = Number(!update.favorite);
      this.savedPasswordsService.save(update)
        .subscribe(() => this.refresh());
    }
  }

  public deletePassword(id: string): void {
    const del = this.passwordCache.find(pwd => pwd.name === id);

    if (del) {
      this.savedPasswordsService.delete(id)
        .subscribe(() => this.refresh());
    }
  }

  private refresh(): void {
    this.savedPasswords = this.savedPasswordsService.getAll()
    .pipe(tap(pwds => this.passwordCache = pwds));
  }

  private showMessage(type: 'success' | 'error' | 'warning', id: string): void {
    const uiMessage = this.uiMessages.get(id);

    if (!uiMessage) {
      throw Error('Could not find requested message');
    }

    switch (type) {
      case 'success':
        this.toastrService.success(uiMessage.message, uiMessage.title);
        break;
      case 'error':
        this.toastrService.error(uiMessage.message, uiMessage.title);
        break;
      case 'warning':
        this.toastrService.warning(uiMessage.message, uiMessage.title);
        break;
    }
  }
}
