import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GoesToService, PicdocService, PlaceOptionsService } from '@compvid/xplat/features';
import { PicdocformBaseComponent } from '@compvid/xplat/features';
import { IonAccordionGroup } from '@ionic/angular';

// ionic
@Component({
  selector: 'compvid-picdocform',
  templateUrl: 'picdocform.component.html',
})
export class PicdocformComponent extends PicdocformBaseComponent {
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;

  text = "ionic Picdocform";
  constructor( public picDocService: PicdocService,
     public placeOptionsService: PlaceOptionsService,
     public goesToService: GoesToService,
     public fb: FormBuilder) {
    super(picDocService,
       placeOptionsService,
         goesToService,
        fb);
  }

  addItemSeen() {
    super.addItemSeen(); // add the form entry
    this.accordionGroup.value='itemsseen'; // keep form open for typing
  }

}
