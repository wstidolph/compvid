import { NgModule } from '@angular/core';
import { MplayModule as SharedMplayModule } from '@compvid/xplat/features';
import { UIModule } from '../ui/ui.module';
import { MPLAY_COMPONENTS } from './components';

@NgModule({
  imports: [SharedMplayModule, UIModule],
  declarations: [...MPLAY_COMPONENTS],
  exports: [...MPLAY_COMPONENTS],
})
export class MplayModule {}
