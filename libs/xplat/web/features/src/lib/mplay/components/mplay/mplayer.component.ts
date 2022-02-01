import { Component, ElementRef } from '@angular/core';

import { CueIOService, CuemgrService, MediacoordService, MediaIOService, MplayerBaseComponent } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-mplayer',
  templateUrl: 'mplayer.component.html',
})
export class MplayerComponent extends MplayerBaseComponent {
  constructor(
    public ref: ElementRef,
    public mcsvc: MediacoordService,
    public cmgrsvc: CuemgrService,
    public ciosvc: CueIOService,
    public miosvc: MediaIOService)
   {
    super(ref, mcsvc, cmgrsvc, ciosvc, miosvc);
   }
}
