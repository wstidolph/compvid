import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicFormService, DynamicSelectModel } from '@ng-dynamic-forms/core';
import { PicdocformBaseComponent, PlaceOptionsService } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-picdocform',
  templateUrl: 'picdocform.component.html',
})
export class PicdocformComponent extends PicdocformBaseComponent {


  constructor(public dynamicFormService: DynamicFormService, public poService: PlaceOptionsService) {
    super(dynamicFormService, poService);

  }

}
