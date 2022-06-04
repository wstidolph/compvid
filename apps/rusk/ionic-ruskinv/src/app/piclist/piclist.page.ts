import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { PicDoc, PicdocService } from '@compvid/xplat/features';
import Swiper, { SwiperOptions, Virtual } from 'swiper';
import { SwiperComponent, EventsParams } from 'swiper/angular';
import SwiperCore, {
  Grid,
  Pagination,
  Navigation,
  Scrollbar
} from 'swiper';
import { tap } from 'rxjs/operators';
SwiperCore.use([Grid,
  // Pagination,
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
export class PiclistPage implements OnInit, AfterViewInit {

  pdArray: PicDoc[] = [];
  // for imagekit:
  // transform=[{ height: "200", width: "200" }]

  @ViewChild('swiper') swiper: SwiperComponent;

  config: SwiperOptions = {
    slidesPerView: 2,
    grid:{
       rows: 2
    },
    spaceBetween:30,
    // pagination:{
    //   clickable: true
    // }
    // effect: 'cube'
  }

  constructor(public picdocService: PicdocService) { }

  ngOnInit() {
    this.picdocService.getPicDocs().pipe(
      tap(pda => this.pdArray = pda),
      tap(pda => console.log('ngOnInit pdArray', this.pdArray))
    ).subscribe();

        // this.picdocService.getPicDocById('test').subscribe(pd => {
    //   this.pdArray.push({...pd, img_basename:'20220305_082626.jpg'});
    //   this.pdArray.push({...pd});
    //   this.pdArray.push({...pd, img_basename:'20220305_081449.jpg'});
    //   this.pdArray.push({...pd, img_basename:'20220305_081537.jpg'});
    //   this.pdArray.push({...pd, img_basename:'20220305_081730.jpg'});
    //   this.pdArray.push({...pd, img_basename:'20220305_081736.jpg'});
    //   this.pdArray.push({...pd, img_basename:'20220305_081746.jpg'});
    // });
  }

  ngAfterViewInit(): void {
    // console.log('swiper inits to ', this.swiper);
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }

  ngAfterContentChecked(): void {
    // if (this.swiper) {
    //   this.swiper.updateSwiper({});
    // }
  }

  swiperSlideChanged(e) {
    console.log('swiper slide changed: ', e);
  }

}
