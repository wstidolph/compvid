import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { PicDoc, PicdocService } from '@compvid/xplat/features';
import { Observable } from 'rxjs';

@Component({
  selector: 'compvid-picpage',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit {
  picdoc: PicDoc;


  constructor(public picdocService: PicdocService,
    public route: ActivatedRoute) { }

  ngOnInit() { // looking for picdoc
    this.picdoc = this.route.snapshot.data['picdoc']
    // console.log('PicturePage ngOnInit picdoc', this.picdoc);
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }


}
