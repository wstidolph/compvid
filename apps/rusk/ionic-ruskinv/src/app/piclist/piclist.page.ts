import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { PicDoc, PicdocService } from '@compvid/xplat/features';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { environment } from '../../environments/environment'
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

  // for ng-gallery
  images: GalleryItem[];

  twicdomain = environment.twicpics.domain;

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

  // use ionViewWill* because init/destroy not always called by Ionic (keeps pages on a stack)
  ionViewWillEnter() {
    const sub = this.picdocService.getPicDocs().pipe(
      take(1), // testing - just look at forst entry
      tap(pda => this.pdArray = pda),
      tap(pda => console.log('ionViewWillEnter in sub pdArray', this.pdArray)),
        // tap(pda => this.copyToImages(pda) )
    ).subscribe();

    this.subs.push(sub);

  }

  // for the 'gallery' text, which I don't like
  copyToImages(pda: PicDoc[]) {
    const localImages:GalleryItem[] = [];

    pda.forEach(pd => localImages.push(new ImageItem({
      src: `${environment.twicpics.domain}/${pd.img_basename}`,
      thumb: `${environment.twicpics.domain}/${pd.img_basename}`
    })))
    this.images = localImages;
    console.log('copyToImages images', this.images)
  }
  ionViewWillLeave() {
    console.log('piclistpage ionViewWillLeave', this.subs)
    this.subs.forEach(s => {s.unsubscribe()})
    this.images=[];
    console.log('piclistpage ionViewWillLeave after unsub',this.subs)
  }

  ngOnDestroy(): void { // just in case
    this.subs.forEach(s => {s.unsubscribe()})
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
