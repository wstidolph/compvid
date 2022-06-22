import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { PicDoc, PicdocService } from '@compvid/xplat/features';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { environment } from '../../environments/environment'

import { take, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'compvid-piclist',
  templateUrl: './piclist.page.html',
  styleUrls: ['./piclist.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PiclistPage implements OnInit, AfterViewInit, OnDestroy {

  pdArray: PicDoc[] = [];

  twicdomain = environment.twicpics.domain;

  subs: Subscription[] = [];

  constructor(public picdocService: PicdocService) { }

  ngOnInit() {

  }

  // use ionViewWill* because init/destroy not always called by Ionic (keeps pages on a stack)
  ionViewWillEnter() {
    const sub = this.picdocService.getPicDocs().pipe(
      take(1), // so we get completion
      tap(pda => console.log('ionViewWillEnter in sub pdArray', this.pdArray)),
    ).subscribe(pda => this.pdArray = pda);

    this.subs.push(sub);

  }

  ionViewWillLeave() {
    console.log('piclistpage ionViewWillLeave', this.subs)
    this.subs.forEach(s => {s.unsubscribe()})
    console.log('piclistpage ionViewWillLeave after unsub',this.subs)
  }

  ngOnDestroy(): void { // just in case
    this.subs.forEach(s => {s.unsubscribe()})
  }

  ngAfterViewInit(): void {

  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }

}
