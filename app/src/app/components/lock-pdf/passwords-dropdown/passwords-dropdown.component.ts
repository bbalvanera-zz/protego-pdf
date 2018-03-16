import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SavedPasswordsService } from '../../../services/saved-passwords.service';
import { SavedPassword } from '../../../../modules/protego-pdf-database/entities/saved-password';
import { Logger } from '../../../shared/logging/logger';

@Component({
  selector: 'app-passwords-dropdown',
  templateUrl: './passwords-dropdown.component.html',
  styleUrls: ['./passwords-dropdown.component.scss']
})
export class PasswordsDropdownComponent implements OnInit {
  private favoritePasswords: SavedPassword[];

  @Output() public passwordSelected: EventEmitter<string>;
  @Output() public savePassword: EventEmitter<void>;

  constructor(private savedPasswordsService: SavedPasswordsService) {
    this.passwordSelected = new EventEmitter();
    this.savePassword = new EventEmitter();
  }

  public ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    this.savedPasswordsService.getFavorites()
    .subscribe(
      favorites => this.favoritePasswords = favorites,
      err => Logger.error(`[PasswordsDropdown.refresh] Error in PwdService.getFavorites: ${err.errorDescription}`)
    );
  }

  private selectPassword(name: string): void {
    const selected = this.favoritePasswords
      .find(pwd => pwd.name === name);

    if (selected) {
      this.passwordSelected.emit(selected.password);
    }
  }

  private savePasswordRequested(): void {
    this.savePassword.emit();
  }
}
