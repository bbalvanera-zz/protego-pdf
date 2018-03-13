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
