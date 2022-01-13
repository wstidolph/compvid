import { NgModule } from '@angular/core';

// xplat
import { UIModule } from '@compvid/xplat/ionic/features';

const MODULES = [UIModule];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class SharedModule {}
