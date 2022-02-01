import { Component, ElementRef, OnInit } from '@angular/core';
import { MplayerBaseComponent, CuemgrService, MediacoordService, CueIOService, MediaIOService } from '@compvid/xplat/features';

// IONIC component
@Component({
  selector: 'compvid-mplayer',
  templateUrl: 'mplayer.component.html',
})
export class MplayerComponent extends MplayerBaseComponent implements OnInit {

  constructor(
    public ref: ElementRef,
    public mcsvc: MediacoordService,
    public cmgrsvc: CuemgrService,
    public ciosvc: CueIOService,
    public miosvc: MediaIOService) {
    super(ref, mcsvc, cmgrsvc, ciosvc, miosvc);
  }

  ngOnInit(): void {
      // "wiring" check: overrides string from base component using serivce call
  }
}

