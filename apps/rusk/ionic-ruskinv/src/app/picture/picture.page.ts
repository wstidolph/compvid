import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { PicDoc, PicdocService, UserService } from '@compvid/xplat/features';
import { Observable } from 'rxjs';


@Component({
  selector: 'compvid-picpage',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit {
  picdoc: PicDoc;

  isFav = false;

  constructor(public picdocService: PicdocService,
    public route: ActivatedRoute) { }

  ngOnInit() { // looking for picdoc
    this.picdoc = this.route.snapshot.data['picdoc']
    this.isFav = this.picdocService.isFavOf(this.picdoc);
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }

  clickFav() {
    this.isFav = !this.isFav;
    this.picdocService.setFavState(this.picdoc, this.isFav);
  }
  deletePicture(picdocid:string) {
    console.log('trash pic', picdocid);
    // nav back
  }

}
