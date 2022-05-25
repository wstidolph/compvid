import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { PicDoc } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-picpage',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit {

  picname = 'test'
  testpd: PicDoc = {
    name: 'test',
    desc: 'a description',
    editDate: Timestamp.fromDate(new Date()),
    loc: 'inside.kitchen.pantry.top_shelf',
    storageId: 'local_storage_id',
    mediaUrl: 'https://stidolph.com/kestate/20220305_081603.jpg',
    downloadURL: 'https://stidolph.com/kestate/20220305_081603.jpg',
    numItemsseen: 0,
    recipients: [],
    itemsseen: [{
      desc: 'blue/white bowl, 10\"',
      addedOn: Timestamp.fromDate(new Date())
    }]
  }

  constructor() { }

  ngOnInit() {
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }


}
