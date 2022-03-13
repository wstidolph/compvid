import { Component } from '@angular/core';

import { CuesWrapperBaseComponent } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-cues-wrapper',
  templateUrl: 'cues-wrapper.component.html',
})
export class CuesWrapperComponent extends CuesWrapperBaseComponent {
  constructor() {
    super();
  }
}
