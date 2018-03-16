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
