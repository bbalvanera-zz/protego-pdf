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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ElectronService } from '../../../services/electron.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private modal: NgbActiveModal, private electronService: ElectronService) { }

  public ngOnInit(): void {
    return;
  }

  public dismissModal(): void {
    if (this.modal) {
      this.modal.dismiss(); // manual close
    }
  }

  public showLicense(): boolean {
    this.electronService.openLicense();
    return false;
  }

  public showSourceCode(): boolean {
    this.electronService.openSourceCode();
    return false;
  }

  public showCredits(): boolean {
    this.electronService.openCredits();
    return false;
  }
}
