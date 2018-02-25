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
  private unsubscribe: Subject<void>;
  private currentCssClass: string;
  private source: HTMLInputElement;
  private target: HTMLElement;

  public readonly passwordStrength: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.unsubscribe     = new Subject<void>();
    this.currentCssClass = CSS_STRENGTH_MAP[DEFAULT_STRENGTH];
  }

  public ngOnInit(): void {
    const parent  = this.el.nativeElement as HTMLElement;
    this.source   = parent.querySelector('.password-input') as HTMLInputElement;
    this.target   = parent.querySelector('.password-strength') as HTMLElement;

    const input   = fromEvent<void>(this.source, 'input');
    const change  = fromEvent<void>(this.source, 'change');

    const onInputChange = merge(input, change);

    onInputChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.updatePasswordStrength());

    this.setStrength(DEFAULT_STRENGTH);
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  public updatePasswordStrength(): void {
    const value = this.source.value;
    let strength = DEFAULT_STRENGTH;

    if (value && value.length > 0) {
      strength = zxcvbn(value).score;
    }

    this.setStrength(strength);
  }

  private setStrength(strength: number): void {
    if (strength === this.passwordStrength) {
      return;
    }

    this.renderer.removeClass(this.target, this.currentCssClass);
    const cssClass = CSS_STRENGTH_MAP[strength];

    this.renderer.addClass(this.target, cssClass);
    this.currentCssClass = cssClass;
    (this as { passwordStrength: number }).passwordStrength = strength;
  }
}
