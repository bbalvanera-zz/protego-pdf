import { UIMessagesDirective } from './ui-messages.directive';
import { UIMessageDirective } from './ui-message.directive';
import { Provider } from '@angular/core';

export {
  UIMessagesDirective,
  UIMessageDirective
};

export const SHARED_DIRECTIVES: Provider[] = [
  UIMessagesDirective,
  UIMessageDirective
];
