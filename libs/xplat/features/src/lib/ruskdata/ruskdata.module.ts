import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { PicdocformBaseComponent } from './base';
import { DynamicFormsCoreModule} from '@ng-dynamic-forms/core';

// base
@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [DynamicFormsCoreModule],
  exports: [DynamicFormsCoreModule],
  declarations: [PicdocformBaseComponent]
})
export class RuskdataModule {}
