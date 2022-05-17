import { Component } from '@angular/core';

import { BaseComponent } from '@compvid/xplat/core';
import { DatapicbaseBaseComponent, PicdocService } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-datapic',
  templateUrl: 'datapic.component.html',
})
export class DatapicComponent extends DatapicbaseBaseComponent {
  constructor(public picdocService: PicdocService) {
    super(picdocService);
  }
}
