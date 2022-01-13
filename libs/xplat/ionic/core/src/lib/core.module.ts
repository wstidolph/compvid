import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { throwIfAlreadyLoaded } from '@compvid/xplat/utils';
import { CompvidCoreModule } from '@compvid/xplat/web/core';

@NgModule({
  imports: [CompvidCoreModule, IonicModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class CompvidIonicCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CompvidIonicCoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CompvidIonicCoreModule');
  }
}
