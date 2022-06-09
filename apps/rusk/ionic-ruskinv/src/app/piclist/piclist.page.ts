import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { PicDoc, PicdocService } from '@compvid/xplat/features';
import Swiper, { SwiperOptions, Virtual } from 'swiper';
import { SwiperComponent, EventsParams } from 'swiper/angular';
import SwiperCore, {
  Grid,
   Pagination,
  // Navigation,
  // Scrollbar
} from 'swiper';
import { take, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
SwiperCore.use([
  Grid,
  Pagination,
  // Navigation,
  // Virtual
  // EffectCube,
  ]);

@Component({
  selector: 'compvid-piclist',
  templateUrl: './piclist.page.html',
  styleUrls: ['./piclist.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PiclistPage implements OnInit, AfterViewInit, OnDestroy {

  pdArray: PicDoc[] = [];
  // for imagekit:
  // transform=[{ height: "200", width: "200" }]

  @ViewChild('swiper') swiper: SwiperComponent;

  config: SwiperOptions = {

     slidesPerView: 2,
     grid:{
       rows: 3,

    },
    loop: false,
    // spaceBetween:5,
    // virtual: true,
    pagination:{
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      }
    }
    // effect: 'cube'
  }

  subs: Subscription[] = [];

  constructor(public picdocService: PicdocService) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    const sub = this.picdocService.getPicDocs().pipe(
      take(1),
      tap(pda => this.pdArray = pda),
      tap(pda => console.log('ionViewWillEnter in sub pdArray', this.pdArray))
    ).subscribe();

    this.subs.push(sub);
    console.log('piclistpage ionviewwillenter subs', this.subs)
  }
  ionViewWillLeave() {
    console.log('piclistpage ionViewWillLeave', this.subs)
    this.subs.forEach(s => {s.unsubscribe()})
    console.log('piclistpage ionViewWillLeave after unsub',this.subs)
  }

  ngOnDestroy(): void {
    console.log('piclistpage ngOnDestroy', this.subs);
    this.subs.forEach(s => {s.unsubscribe()})
    console.log('piclistpage ngOnDestroy after unsub',this.subs)
  }

  ngAfterViewInit(): void {
    // console.log('swiper inits to ', this.swiper);
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  swiperSlideChanged(e) {
    console.log('swiper slide changed: ', e);
  }

}
