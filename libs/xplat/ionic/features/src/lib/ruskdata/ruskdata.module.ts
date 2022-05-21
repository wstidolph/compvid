import { NgModule } from '@angular/core';
import { RuskdataModule as SharedRuskdataModule } from '@compvid/xplat/features';
import { UIModule } from '../ui/ui.module';
import { PicdocformComponent } from './components';
// import { DynamicFormsCoreModule} from '@ng-dynamic-forms/core'; // is in SharedRuskDataModule
import { DynamicFormsIonicUIModule } from "@ng-dynamic-forms/ui-ionic";

// ionic
@NgModule({
  imports: [SharedRuskdataModule,
    UIModule,
 //   DynamicFormsCoreModule, is in SharedRuskDataModule
    DynamicFormsIonicUIModule,],
  declarations: [PicdocformComponent],
  exports: [PicdocformComponent]
})
export class RuskdataModule {}
