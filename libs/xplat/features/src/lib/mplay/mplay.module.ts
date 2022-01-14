import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { MPLAY_DIRECTIVES } from './directives';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [VgCoreModule, VgBufferingModule, VgControlsModule],
  exports: [
    // for the children :)
    VgCoreModule,
    VgBufferingModule,
    VgControlsModule,
    ...MPLAY_DIRECTIVES,
  ],
  declarations: [...MPLAY_DIRECTIVES],
})
export class MplayModule {}
