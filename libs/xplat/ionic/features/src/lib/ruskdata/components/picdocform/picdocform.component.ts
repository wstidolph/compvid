import { Component } from '@angular/core';
import { PlaceOptionsService } from '@compvid/xplat/features';
import { PicdocformBaseComponent } from '@compvid/xplat/features';

// ionic
@Component({
  selector: 'compvid-picdocform',
  templateUrl: 'picdocform.component.html',
})
export class PicdocformComponent extends PicdocformBaseComponent {
  text = "ionic Picdocform";
  constructor( public placeOptionsService: PlaceOptionsService) {
    super(placeOptionsService);
  }
}
