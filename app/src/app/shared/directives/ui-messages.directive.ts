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

import { Directive, ContentChildren, QueryList } from '@angular/core';

import { UIMessageDirective } from './ui-message.directive';

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
