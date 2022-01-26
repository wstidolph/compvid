import { Component, OnInit } from '@angular/core';
import { CuemgrService } from '../cuemgr.service';

@Component({
  selector: 'compvid-testcue',
  templateUrl: './testcue.component.html',
  styleUrls: ['./testcue.component.css']
})
export class TestcueComponent {

  constructor(public cuemgrSvc: CuemgrService) {  }

  attachCues(track: TextTrack) {
    const attachedCueCount =
      this.cuemgrSvc.attachCuesForMedia('test_media',track, 'dummy_user');
    console.log('Testcue attached', attachedCueCount);
    return attachedCueCount;
  }

}
