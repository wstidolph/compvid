import { NgModule } from '@angular/core';
import { DatapicModule as SharedDatapicModule } from '@compvid/xplat/features';
import { UIModule } from '../ui/ui.module';
import { DATAPIC_COMPONENTS } from './components';

@NgModule({
  imports: [SharedDatapicModule, UIModule],
  declarations: [...DATAPIC_COMPONENTS],
  exports: [...DATAPIC_COMPONENTS],
})
export class DatapicModule {}
