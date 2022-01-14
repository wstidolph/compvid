import { Component, ElementRef } from '@angular/core';

import { CuemgrService, MediacoordService, MplayerBaseComponent } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-mplayer',
  templateUrl: 'mplayer.component.html',
})
export class MplayerComponent extends MplayerBaseComponent {
  constructor(
    public ref: ElementRef,
    public mcsvc: MediacoordService,
    public cmgrsvc: CuemgrService)
   {
    super(ref, mcsvc, cmgrsvc);
   }
}
