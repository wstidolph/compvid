import { NgModule } from '@angular/core';
import { RuskdataModule as SharedRuskdataModule } from '@compvid/xplat/features';
import { UIModule } from '../ui/ui.module';

@NgModule({
  imports: [SharedRuskdataModule, UIModule],
})
export class RuskdataModule {}
