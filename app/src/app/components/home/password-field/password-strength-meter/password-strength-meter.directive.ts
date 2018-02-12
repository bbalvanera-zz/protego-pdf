import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';
import { Subject } from 'rxjs/Subject';

const zxcvbn = window.require('zxcvbn');
const cssClasses = {
  '-1': 'default',
  '0' : 'weak',
  '1' : 'weak',
  '2' : 'medium',
  '3' : 'good',
  '4' : 'strong'
};
const DEFAULT_CSS_CLASS = -1;

@Directive({
  selector: '[appPasswordStrengthMeter]'
})
export class PasswordStrengthMeterDirective implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private currentCssClass = '';

  private source: HTMLInputElement;
  private target: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.currentCssClass = cssClasses[DEFAULT_CSS_CLASS];
  }

  public ngOnInit(): void {
    const parent = this.el.nativeElement as HTMLElement;
    this.source = parent.querySelector('.password-input') as HTMLInputElement;
    this.target = parent.querySelector('.password-strength') as HTMLElement;

    const input = fromEvent<string>(this.source, 'input');

    input
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(value => this.updatePasswordScore(this.source.value));

    this.setCssClass(DEFAULT_CSS_CLASS);
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  private updatePasswordScore(value: any): void {
    if (!value || value.length === 0) {
      this.setCssClass(-1);
    }

    const result = zxcvbn(value);
    this.setCssClass(result.score);
  }

  private setCssClass(id: number): void {
    this.renderer.removeClass(this.target, this.currentCssClass);

    const cssClass = cssClasses[id];
    this.renderer.addClass(this.target, cssClass);
    this.currentCssClass = cssClass;
  }
}
