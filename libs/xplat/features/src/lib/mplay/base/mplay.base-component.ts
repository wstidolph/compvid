import { Directive } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';

@Directive()
export abstract class MplayBaseComponent extends BaseComponent {
  public text: string = 'Mplay';

  constructor() {
    super();
  }
}
