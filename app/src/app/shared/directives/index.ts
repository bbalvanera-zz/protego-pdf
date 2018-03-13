import { Provider } from '@angular/core';

import { UIMessagesDirective } from './ui-messages.directive';
import { UIMessageDirective } from './ui-message.directive';
import { FocusWithinDirective } from './focus-within.directive';

export {
  UIMessagesDirective,
  UIMessageDirective,
  FocusWithinDirective
};

export const SHARED_DIRECTIVES: Provider[] = [
  UIMessagesDirective,
  UIMessageDirective,
  FocusWithinDirective
];
