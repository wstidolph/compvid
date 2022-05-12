import { Component } from '@angular/core';

import { UserBaseComponent } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-user',
  templateUrl: 'user.component.html',
})
export class UserComponent extends UserBaseComponent {
  constructor() {
    super();
  }
}
