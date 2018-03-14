import { NgModule } from '@angular/core';

import { SHARED_DIRECTIVES } from './directives/index';
import { SHARED_PIPES } from './pipes/index';

@NgModule({
  declarations: [SHARED_DIRECTIVES, SHARED_PIPES],
  exports: [SHARED_DIRECTIVES, SHARED_PIPES]
})
export class SharedModule { }
