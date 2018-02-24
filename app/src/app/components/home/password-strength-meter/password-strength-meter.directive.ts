import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { merge } from 'rxjs/observable/merge';
import { Subject } from 'rxjs/Subject';

const zxcvbn = window.require('zxcvbn');
const CSS_STRENGTH_MAP = {
  '-1': 'default',
  '0' : 'weak',
  '1' : 'weak',
  '2' : 'medium',
  '3' : 'good',
  '4' : 'strong'
};
const DEFAULT_STRENGTH = -1;

@Directive({
  selector: '[appPasswordStrengthMeter]'
})
export class PasswordStrengthMeterDirective implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private currentCssClass = '';

  private source: HTMLInputElement;
  private target: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.currentCssClass = CSS_STRENGTH_MAP[DEFAULT_STRENGTH];
  }

  public ngOnInit(): void {
    const parent = this.el.nativeElement as HTMLElement;
    this.source = parent.querySelector('.password-input') as HTMLInputElement;
    this.target = parent.querySelector('.password-strength') as HTMLElement;

    const input   = fromEvent<void>(this.source, 'input');
    const change  = fromEvent<void>(this.source, 'change');
    const handler = merge(input, change);

    handler
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.updatePasswordStrength());

    this.setStrength(DEFAULT_STRENGTH);
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  public updatePasswordStrength(): void {
    const value = this.source.value;

    if (!value || value.length === 0) {
      this.setStrength(DEFAULT_STRENGTH);
      return;
    }

    const result = zxcvbn(value);
    this.setStrength(result.score);
  }

  private setStrength(strength: number): void {
    this.renderer.removeClass(this.target, this.currentCssClass);

    const cssClass = CSS_STRENGTH_MAP[strength];
    this.renderer.addClass(this.target, cssClass);
    this.currentCssClass = cssClass;
  }
}
