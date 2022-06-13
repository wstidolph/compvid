import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'
import { ImagekitioAngularModule } from 'imagekitio-angular'
import { TwicPicsComponentsModule } from '@twicpics/components/angular13'
import { RuskdataModule  } from '@compvid/xplat/ionic/features'

import { SwiperModule } from 'swiper/angular';
import { GalleryModule, GALLERY_CONFIG  } from 'ng-gallery';


import { PiclistPageRoutingModule } from './piclist-routing.module';

import { PiclistPage } from './piclist.page';

// ionic-ruskinv
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TwicPicsComponentsModule,
    IonicModule,
    ImagekitioAngularModule,
    SwiperModule,
    GalleryModule,
    RuskdataModule,
    PiclistPageRoutingModule
  ],
  providers: [
    {
      provide: GALLERY_CONFIG,
      useValue: {
        dots: true,
        imageSize: 'cover'
      }
    }
  ],
  declarations: [PiclistPage]
})
export class PiclistPageModule {}
