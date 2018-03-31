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

import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { fromEvent} from 'rxjs/observable/fromEvent';
import { takeUntil } from 'rxjs/operators/takeUntil';

@Directive({
  selector: '[appFocusWithin]'
})
export class FocusWithinDirective implements OnInit, OnDestroy {
  private unsubscriber = new Subject<void>();

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  public ngOnInit(): void {
    const target = this.el.nativeElement as HTMLElement;
    const input  = target.querySelectorAll('input');

    const onFocus = fromEvent(input, 'focus');
    const onBlur  = fromEvent(input, 'blur');

    onFocus
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(_ => this.renderer.addClass(target, 'focus'));

    onBlur
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(_ => this.renderer.removeClass(target, 'focus'));
  }

  public ngOnDestroy(): void {
    this.unsubscriber.next();
  }
}
