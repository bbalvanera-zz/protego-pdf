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

import { Directive, Input, ContentChild, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'app-ui-message'
})
export class UIMessageDirective implements AfterViewInit {
  @Input() public readonly id: string;
  @Input() public readonly title: string;

  public readonly message: string;

  constructor(private el: ElementRef) { }

  public ngAfterViewInit(): void {
    if (this.el) {
      (this as { message: string }).message = this.el.nativeElement.textContent;
      this.el.nativeElement.innerHTML = '';
    }
  }
}
