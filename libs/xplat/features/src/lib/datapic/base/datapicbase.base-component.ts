import { Component, Input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { BaseComponent } from '@compvid/xplat/core';
import { PicDoc } from '@compvid/xplat/features';
import { PicdocService } from '../../ruskdata';

@Component({
  selector: 'dpbase',
  template: '<p>Datapicbase works</p>',
  styles: []
})
export abstract class DatapicbaseBaseComponent extends BaseComponent {
  @Input() picdoc: PicDoc;

  dummyPD : PicDoc = {
    name: 'some stuff',
    uploadedBy: 'WS',
    mediaUrl: 'https://stidolph.com/kestate/20220305_081749.jpg',
    storageId: 'rusk_'+ new Date().getTime() / 1000,
    editDate: new Timestamp(0,0),
    numItemsseen: 0
  }
  constructor(public picdocService: PicdocService) {
    super();
    this.picdoc=this.dummyPD;
  }
}
