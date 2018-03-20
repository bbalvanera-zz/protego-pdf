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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { ElectronService } from '../../../services/electron.service';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lock-success-toastr',
  templateUrl: './lock-success-toastr.component.html',
  styleUrls: ['./lock-success-toastr.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        opacity: 0,
      })),
      state('active', style({})),
      state('removed', style({ opacity: 0 })),
      transition('inactive => active',
        animate('{{ easeTime }}ms {{ easing }}')
      ),
      transition('active => removed',
        animate('{{ easeTime }}ms {{ easing }}'),
      ),
    ]),
  ],
  preserveWhitespaces: false,
})
export class LockSuccessToastrComponent extends Toast implements OnInit {
  private dir: string;

  constructor(
    private storageService: StorageService,
    private electronService: ElectronService,
    public toastPackage: ToastPackage,
    toastrService: ToastrService) {
      super(toastrService, toastPackage);
  }

  public get showLink(): boolean { return this.dir && this.dir !== ''; }

  public ngOnInit(): void {
    this.dir = this.storageService.popLockPdfDir();
  }

  public view(event: Event): void {
    event.stopPropagation();

    if (this.dir) {
      this.electronService.openFileManager(this.dir);
      this.toastPackage.triggerAction();
    }
  }
}
