import { Component } from '@angular/core';

import { MplayBaseComponent } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-mplay',
  templateUrl: 'mplay.component.html',
})
export class MplayComponent extends MplayBaseComponent {
  constructor() {
    super();
  }
}
