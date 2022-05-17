import { Component, Input } from '@angular/core';

import { BaseComponent } from '@compvid/xplat/core';
import { PicDoc } from '@compvid/xplat/features';

//ionic

@Component({
  selector: 'compvid-dpitemseen',
  templateUrl: 'dpitemseen.component.html',
})
export class DpitemseenComponent extends BaseComponent {
  @Input() picdoc!: PicDoc;

  constructor() {
    super();
  }
}
