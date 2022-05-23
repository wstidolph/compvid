import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { PicdocformBaseComponent } from './base';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [ReactiveFormsModule],
  declarations: [PicdocformBaseComponent]
})
export class RuskdataModule {}
