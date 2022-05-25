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
    console.log('component addItemSeen super()  done, now value ',this.accordionGroup.value);

    this.accordionGroup.value='itemsseen';
    console.log('component addItemSeen done, now value ',this.accordionGroup.value);
  }

  AGValChanged() {
    console.log('AG Val',this.accordionGroup.value);
  }
  toggleAG() {
    this.accordionGroup.value=='core' ? this.accordionGroup.value='itemsseen' : this.accordionGroup.value='core';
  }
}
