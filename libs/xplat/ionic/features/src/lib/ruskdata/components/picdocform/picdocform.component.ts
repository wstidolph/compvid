import { AfterContentChecked, Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GoesToService, PicdocService, PlaceOptionsService } from '@compvid/xplat/features';
import { PicdocformBaseComponent } from '@compvid/xplat/features';
import { IonAccordionGroup, IonRouterOutlet, ModalController } from '@ionic/angular';
import { PdclosemodalComponent } from '../pdclosemodal/pdclosemodal.component'

import Swiper, { SwiperOptions, EffectFlip } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
Swiper.use([EffectFlip]);
// ionic
@Component({
  selector: 'compvid-picdocform',
  templateUrl: 'picdocform.component.html',
  styles: ['#ishheader::part(native) { color:red }']
})
export class PicdocformComponent extends PicdocformBaseComponent /* implements AfterContentChecked */ {

  public swiperConfig: SwiperOptions = {
   // direction: 'vertical'
   effect: 'flip'

  }
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;
  // @ViewChild('swiper', { static: false }) swiper: SwiperComponent;

  @Output() abandonEdits = new EventEmitter();
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
  // ngAfterContentChecked(): void {
  //   if (this.swiper) {
  //     this.swiper.updateSwiper({});
  //   }
  // }
  // swiperSlideChanged(e) {
  //   console.log('swiperSlide changed: ', e);
  // }

  addItemSeen(evt: { stopPropagation: () => void; }) {
    evt.stopPropagation();
    super.addItemSeen(evt); // add the form entry event
                            // base doesn't care about the data
    this.accordionGroup.value='itemsseen'; // keep form open for typing
  }

  removeItemSeen(idx: number) {
    super.removeItemSeen(idx);
    // reposition here?
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
      if(dataReturned.data == 'discard'){
        this.abandonEdits.emit();
      }
    });

    return await modal.present();
  }

}
