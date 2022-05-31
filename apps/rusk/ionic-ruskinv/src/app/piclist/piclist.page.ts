import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { PicDoc, PicdocService } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-piclist',
  templateUrl: './piclist.page.html',
  styleUrls: ['./piclist.page.scss'],
})
export class PiclistPage implements OnInit {

  pdArray: PicDoc[] = [];

  constructor(public picdocService: PicdocService) { }

  ngOnInit() {
    this.picdocService.getPicDocById('test').subscribe(pd => {
      this.pdArray.push(pd);
    });
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }


}
