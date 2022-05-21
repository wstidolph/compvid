import { Component } from '@angular/core';
import { DynamicFormService } from '@ng-dynamic-forms/core'
import { PicdocformBaseComponent } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-picdocform',
  templateUrl: 'picdocform.component.html',
})
export class PicdocformComponent extends PicdocformBaseComponent {
  constructor(public dynamicFormService: DynamicFormService) {
    super(dynamicFormService);
  }
}
