import { Directive } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';

@Directive()
export abstract class CuesWrapperBaseComponent extends BaseComponent {
  public text: string = 'CuesWrapper';

  constructor() {
    super();
  }
}
