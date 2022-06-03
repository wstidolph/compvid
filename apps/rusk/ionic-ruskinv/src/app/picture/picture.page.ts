import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { PicDoc, PicdocService } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-picpage',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit {

  pdArray: PicDoc[] = [];

  id = ''
  constructor(public picdocService: PicdocService,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    console.log('PicturePage id', this.id);
    this.picdocService.getPicDocById(this.id).subscribe(pd => {
      this.pdArray.push(pd);
    });
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }


}
