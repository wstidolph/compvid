import { Directive } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';

@Directive()
export class PicdocformBaseComponent extends BaseComponent {
  public text: string = 'Picdocform';

  constructor() {
    super();
  }
}
