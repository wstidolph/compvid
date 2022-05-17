import { Component, Input } from '@angular/core';

import { BaseComponent } from '@compvid/xplat/core';
import { PicDoc } from '@compvid/xplat/features';
// ionic

@Component({
  selector: 'compvid-dpinfo',
  templateUrl: 'dpinfo.component.html',
})
export class DpinfoComponent extends BaseComponent {
  @Input() picdoc!: PicDoc;

  constructor() {
    super();
  }
}
