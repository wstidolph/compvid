import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PicdocService, PlaceOptionsService } from '@compvid/xplat/features';
import { PicdocformBaseComponent } from '@compvid/xplat/features';

// ionic
@Component({
  selector: 'compvid-picdocform',
  templateUrl: 'picdocform.component.html',
})
export class PicdocformComponent extends PicdocformBaseComponent {
  text = "ionic Picdocform";
  constructor( public picDocService: PicdocService,
     public placeOptionsService: PlaceOptionsService,
     public fb: FormBuilder) {
    super(picDocService, placeOptionsService, fb);
  }

}
