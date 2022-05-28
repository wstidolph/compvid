import { NgModule } from '@angular/core';
import { RuskdataModule as SharedRuskdataModule } from '@compvid/xplat/features';
import { UIModule } from '../ui/ui.module';
import { SwiperModule } from 'swiper/angular';
import { PicdocformComponent, PdclosemodalComponent } from './components';

@NgModule({
  imports: [SharedRuskdataModule, UIModule, SwiperModule],
  declarations: [PicdocformComponent, PdclosemodalComponent],
  exports: [PicdocformComponent]
})
export class RuskdataModule {}
