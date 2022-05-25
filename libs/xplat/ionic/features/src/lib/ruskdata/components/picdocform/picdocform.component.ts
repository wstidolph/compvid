import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GoesToService, PicdocService, PlaceOptionsService } from '@compvid/xplat/features';
import { PicdocformBaseComponent } from '@compvid/xplat/features';
import { IonAccordionGroup, IonRouterOutlet, ModalController } from '@ionic/angular';
import { PdclosemodalComponent } from '../pdclosemodal/pdclosemodal.component'

// ionic
@Component({
  selector: 'compvid-picdocform',
  templateUrl: 'picdocform.component.html',
})
export class PicdocformComponent extends PicdocformBaseComponent {
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;

  dataReturned: any;

  text = "ionic Picdocform";
  constructor( public picDocService: PicdocService,
     public placeOptionsService: PlaceOptionsService,
     public goesToService: GoesToService,
     public fb: FormBuilder,
     public modalController: ModalController,
     private routerOutlet: IonRouterOutlet) {
    super(picDocService,
       placeOptionsService,
         goesToService,
        fb);
  }

  addItemSeen() {
    super.addItemSeen(); // add the form entry
    this.accordionGroup.value='itemsseen'; // keep form open for typing
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: PdclosemodalComponent,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'pdclose-modal',
      componentProps: {
        "paramID": 123,
        "paramTitle": "Really abandon changes?"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        console.log('Modal Sent Data :', dataReturned);
      }
    });

    return await modal.present();
  }

}
