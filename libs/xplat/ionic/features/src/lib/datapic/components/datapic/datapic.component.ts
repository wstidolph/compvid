import { Component, Input } from '@angular/core';

import { BaseComponent } from '@compvid/xplat/core';
import { PicDoc, PicdocService } from '@compvid/xplat/features';
import { Timestamp } from 'firebase/firestore';
import { DatapicbaseBaseComponent } from '@compvid/xplat/features';
// ionic

@Component({
  selector: 'compvid-datapic',
  templateUrl: 'datapic.component.html',
})
export class DatapicComponent extends DatapicbaseBaseComponent {

  constructor(public picdocService: PicdocService) {
    super(picdocService);
  }
}
