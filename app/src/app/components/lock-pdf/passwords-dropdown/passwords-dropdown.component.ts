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
  @Output() public passwordSelected: EventEmitter<string>;
  @Output() public savePassword: EventEmitter<void>;

  public favoritePasswords: SavedPassword[];

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

  public savePasswordRequested(): void {
    this.savePassword.emit();
  }

  private selectPassword(name: string): void {
    const selected = this.favoritePasswords
      .find(pwd => pwd.name === name);

    if (selected) {
      this.passwordSelected.emit(selected.password);
    }
  }
}
