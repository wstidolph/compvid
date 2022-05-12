import { Directive } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';

@Directive()
export abstract class UserBaseComponent extends BaseComponent {
  public text: string = 'User';

  constructor() {
    super();
  }
}
