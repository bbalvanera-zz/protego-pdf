import { Directive, ContentChildren, QueryList } from '@angular/core';

import { UIMessageDirective } from './ui-message/ui-message.directive';

/**
 * The UIMessage directive serves as a means to access ui-messages in code.
 * The idea to have these UI Messages in the template is so they can be
 * subject to translation
 */
@Directive({
  selector: 'app-ui-messages'
})
export class UIMessagesDirective {

  @ContentChildren(UIMessageDirective)
  private uiMessages: QueryList<UIMessageDirective>;

  public get(id: string): { title?: string, message?: string } {
    const message = this.uiMessages.find(msg => msg.id === id);
    return message;
  }
}
