import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'app-ui-message'
})
export class UIMessageDirective {

  @Input() public id: string;
  @Input() public title: string;
  @Input() public message: string;
}
