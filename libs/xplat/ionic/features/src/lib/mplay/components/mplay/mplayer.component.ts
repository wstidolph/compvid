import { Component, ElementRef, OnInit } from '@angular/core';
import { MplayerBaseComponent, CuemgrService, MediacoordService } from '@compvid/xplat/features';

// IONIC component
@Component({
  selector: 'compvid-mplayer',
  templateUrl: 'mplayer.component.html',
})
export class MplayerComponent extends MplayerBaseComponent implements OnInit {

  constructor(
    public ref: ElementRef,
    public mcsvc: MediacoordService,
    public cmgrsvc: CuemgrService) {
    super(ref, mcsvc, cmgrsvc);
  }

  ngOnInit(): void {
      // "wiring" check: overrides string from base component using serivce call
  }
}

